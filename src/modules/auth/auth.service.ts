import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';

const STAFF_ROLES_BLOCKED_ON_APP = new Set(['super_admin', 'admin']);

const MSG_APP_FORBIDDEN_CLUB =
  'Esta cuenta es para el panel de clubes. Usá la web para gestionar tu club o registrate como jugador en la app.';

const MSG_APP_FORBIDDEN_STAFF =
  'Esta cuenta no tiene acceso a la aplicación móvil.';
const MSG_BACKOFFICE_FORBIDDEN = 'Esta cuenta no tiene acceso.';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  private getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
      throw new InternalServerErrorException(
        `Missing required environment variable: ${name}`,
      );
    }
    return value;
  }

  private resolveSupabaseRedirectUrl(client?: 'app' | 'backoffice'): string {
    if (client === 'app') {
      return this.getRequiredEnv('APP_SUPABASE_REDIRECT_URL');
    }
    return this.getRequiredEnv('BACKOFFICE_SUPABASE_REDIRECT_URL');
  }

  private resolveSignUpRedirectUrl(client?: 'app' | 'backoffice'): string {
    const baseUrl = this.getRequiredEnv('ACCOUNT_CONFIRMATION_URL');
    const target =
      client === 'app'
        ? this.getRequiredEnv('APP_SUPABASE_REDIRECT_URL')
        : this.getRequiredEnv('BACKOFFICE_SUPABASE_REDIRECT_URL');

    const url = new URL(baseUrl);
    url.searchParams.set('client', client === 'app' ? 'app' : 'backoffice');
    url.searchParams.set('target', target);
    return url.toString();
  }

  private async syncProfileFromAuth(params: {
    userId: string;
    email?: string | null;
    fullName?: string | null;
    isClub?: boolean;
  }): Promise<void> {
    const email = params.email?.trim() || null;
    const fullName = params.fullName?.trim() || null;
    const updateData: {
      email: string | null;
      fullName: string | null;
      isClub?: boolean;
    } = {
      email,
      fullName,
    };
    if (params.isClub === true) {
      updateData.isClub = true;
    }

    await this.prisma.profile.upsert({
      where: { id: params.userId },
      create: {
        id: params.userId,
        fullName,
        description: '',
        location: '',
        isClub: params.isClub === true,
        phone: null,
        email,
        availability: [],
        amenities: {},
      },
      update: updateData,
    });
  }

  private async assertMobileAppAllowed(
    user: User,
    client: SignInDto['client'],
  ): Promise<void> {
    if (client !== 'app') {
      return;
    }

    const meta = (user.user_metadata ?? {}) as { is_club?: unknown };
    if (meta.is_club === true) {
      throw new ForbiddenException(MSG_APP_FORBIDDEN_CLUB);
    }

    const rolesUnknown = (user.app_metadata as { roles?: unknown } | null)
      ?.roles;
    if (Array.isArray(rolesUnknown)) {
      const blocked = rolesUnknown.some(
        (r) => typeof r === 'string' && STAFF_ROLES_BLOCKED_ON_APP.has(r),
      );
      if (blocked) {
        throw new ForbiddenException(MSG_APP_FORBIDDEN_STAFF);
      }
    }

    if (user.id) {
      const profile = await this.prisma.profile.findUnique({
        where: { id: user.id },
        select: { isClub: true },
      });
      if (profile?.isClub === true) {
        throw new ForbiddenException(MSG_APP_FORBIDDEN_CLUB);
      }
    }
  }

  private async assertBackofficeAllowed(
    user: User,
    client: SignInDto['client'],
  ): Promise<void> {
    if (client === 'app') {
      return;
    }

    const meta = (user.user_metadata ?? {}) as { is_club?: unknown };
    if (meta.is_club === true) {
      return;
    }

    const rolesUnknown = (user.app_metadata as { roles?: unknown } | null)
      ?.roles;
    if (Array.isArray(rolesUnknown)) {
      const hasStaffRole = rolesUnknown.some(
        (r) => typeof r === 'string' && STAFF_ROLES_BLOCKED_ON_APP.has(r),
      );
      if (hasStaffRole) {
        return;
      }
    }

    if (user.id) {
      const profile = await this.prisma.profile.findUnique({
        where: { id: user.id },
        select: { isClub: true },
      });
      if (profile?.isClub === true) {
        return;
      }
    }

    throw new ForbiddenException(MSG_BACKOFFICE_FORBIDDEN);
  }

  private assertSignUpClientConsistency(payload: SignUpDto): void {
    if (payload.client === 'app' && payload.isClub === true) {
      throw new ForbiddenException(
        'Las cuentas de club deben registrarse desde el backoffice.',
      );
    }
    if (payload.client === 'backoffice' && payload.isClub !== true) {
      throw new ForbiddenException(
        'El registro en backoffice solo permite cuentas de club.',
      );
    }
  }

  async signUp(payload: SignUpDto) {
    this.assertSignUpClientConsistency(payload);

    const client = this.supabaseService.getClient();
    const redirectTo = this.resolveSignUpRedirectUrl(payload.client);

    const { data, error } = await client.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: payload.fullName ?? null,
          ...(payload.isClub !== undefined ? { is_club: payload.isClub } : {}),
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (data.user?.id) {
      await this.syncProfileFromAuth({
        userId: data.user.id,
        email: payload.email,
        fullName: payload.fullName ?? null,
        isClub: payload.isClub === true,
      });
    }

    return {
      user: data.user,
      message:
        'User registered successfully. Please confirm your email if required.',
    };
  }

  async signIn(payload: SignInDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message ?? 'Invalid credentials');
    }

    if (data.user) {
      await this.assertMobileAppAllowed(data.user, payload.client);
      await this.assertBackofficeAllowed(data.user, payload.client);
    }

    if (data.user?.id) {
      const metadata = (data.user.user_metadata ?? {}) as {
        full_name?: unknown;
        is_club?: unknown;
      };
      await this.syncProfileFromAuth({
        userId: data.user.id,
        email: data.user.email ?? payload.email,
        fullName:
          typeof metadata.full_name === 'string' ? metadata.full_name : null,
        isClub: metadata.is_club === true,
      });
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }

  async forgotPassword(email: string, authClient?: 'app' | 'backoffice') {
    const client = this.supabaseService.getClient();
    const redirectTo = this.resolveSupabaseRedirectUrl(authClient);

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      message:
        'If an account exists with this email, you will receive a password reset link.',
    };
  }

  async changePassword(
    userId: string,
    userEmail: string | undefined,
    dto: ChangePasswordDto,
  ) {
    if (!userEmail) {
      throw new BadRequestException('User email is missing');
    }

    const client = this.supabaseService.getClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: userEmail,
      password: dto.currentPassword,
    });

    if (signInError) {
      throw new BadRequestException('Current password is incorrect');
    }

    const { error: updateError } = await client.auth.admin.updateUserById(
      userId,
      { password: dto.newPassword },
    );

    if (updateError) {
      throw new BadRequestException(updateError.message);
    }

    return { message: 'Password changed successfully' };
  }

  async deleteAccount(userId: string) {
    const client = this.supabaseService.getClient();

    const { error } = await client.auth.admin.deleteUser(userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Account deleted successfully' };
  }

  async refreshSession(body: RefreshSessionDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: body.refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(
        error?.message ?? 'Session refresh failed',
      );
    }

    if (data.user) {
      await this.assertMobileAppAllowed(data.user, body.client);
      await this.assertBackofficeAllowed(data.user, body.client);
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }
}
