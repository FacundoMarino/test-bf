import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';

jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

import { AuthService } from './auth.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

type SupabaseAuthClientMock = {
  auth: {
    signUp: jest.Mock;
    signInWithPassword: jest.Mock;
    resetPasswordForEmail: jest.Mock;
    admin: {
      updateUserById: jest.Mock;
      deleteUser: jest.Mock;
    };
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let supabaseService: jest.Mocked<SupabaseService>;
  let client: SupabaseAuthClientMock;
  let prisma: jest.Mocked<Pick<PrismaService, 'profile'>>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.ACCOUNT_CONFIRMATION_URL =
      'https://backoffice-iota-neon.vercel.app/confirm-account';
    process.env.BACKOFFICE_SUPABASE_REDIRECT_URL =
      'https://backoffice-iota-neon.vercel.app';
    process.env.APP_SUPABASE_REDIRECT_URL = 'exp://127.0.0.1:8081/--/login';

    client = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        admin: {
          updateUserById: jest.fn(),
          deleteUser: jest.fn(),
        },
      },
    };

    supabaseService = {
      getClient: jest.fn().mockReturnValue(client),
    } as unknown as jest.Mocked<SupabaseService>;

    prisma = {
      profile: {
        upsert: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue(null),
      },
    } as unknown as jest.Mocked<Pick<PrismaService, 'profile'>>;

    service = new AuthService(
      supabaseService,
      prisma as unknown as PrismaService,
    );
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const dto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'Test User',
      } as SignUpDto;

      const user = { id: 'user-id', email: dto.email } as any;

      client.auth.signUp.mockResolvedValue({
        data: { user },
        error: null,
      });

      const result = await service.signUp(dto);

      expect(client.auth.signUp).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
        options: {
          emailRedirectTo:
            'https://backoffice-iota-neon.vercel.app/confirm-account?client=backoffice&target=https%3A%2F%2Fbackoffice-iota-neon.vercel.app',
          data: {
            full_name: dto.fullName,
          },
        },
      });
      expect(result).toEqual({
        user,
        message: expect.stringContaining('User registered successfully'),
      });
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        create: {
          id: 'user-id',
          fullName: 'Test User',
          description: '',
          location: '',
          isClub: false,
          phone: null,
          email: 'test@example.com',
          availability: [],
          amenities: {},
        },
        update: {
          email: 'test@example.com',
          fullName: 'Test User',
        },
      });
    });

    it('should upsert profile with isClub true when isClub is true', async () => {
      const dto: SignUpDto = {
        email: 'club@example.com',
        password: 'Password123!',
        fullName: 'Club Owner',
        isClub: true,
      } as SignUpDto;

      const user = { id: 'club-user-id', email: dto.email } as any;

      client.auth.signUp.mockResolvedValue({
        data: { user },
        error: null,
      });

      await service.signUp(dto);

      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: user.id },
        create: {
          id: user.id,
          fullName: dto.fullName,
          description: '',
          location: '',
          isClub: true,
          phone: null,
          email: 'club@example.com',
          availability: [],
          amenities: {},
        },
        update: {
          email: 'club@example.com',
          fullName: dto.fullName,
          isClub: true,
        },
      });
    });

    it('should use app confirmation bridge url on app sign-up', async () => {
      const dto: SignUpDto = {
        email: 'player@example.com',
        password: 'Password123!',
        fullName: 'Player',
        client: 'app',
      } as SignUpDto;

      const user = { id: 'player-id', email: dto.email } as any;

      client.auth.signUp.mockResolvedValue({
        data: { user },
        error: null,
      });

      await service.signUp(dto);

      expect(client.auth.signUp).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
        options: {
          emailRedirectTo:
            'https://backoffice-iota-neon.vercel.app/confirm-account?client=app&target=exp%3A%2F%2F127.0.0.1%3A8081%2F--%2Flogin',
          data: {
            full_name: dto.fullName,
          },
        },
      });
    });

    it('should throw UnauthorizedException on error', async () => {
      client.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'error' },
      });

      await expect(service.signUp({} as SignUpDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should forbid app sign-up for club accounts', async () => {
      const dto: SignUpDto = {
        email: 'club@app.com',
        password: 'Password123!',
        isClub: true,
        client: 'app',
      } as SignUpDto;

      await expect(service.signUp(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(client.auth.signUp).not.toHaveBeenCalled();
    });

    it('should forbid backoffice sign-up without club flag', async () => {
      const dto: SignUpDto = {
        email: 'user@backoffice.com',
        password: 'Password123!',
        client: 'backoffice',
      } as SignUpDto;

      await expect(service.signUp(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(client.auth.signUp).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should return tokens and user on success', async () => {
      const dto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
        client: 'app',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User', is_club: false },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      const result = await service.signIn(dto);

      expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
      });
      expect(result).toEqual({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user,
      });
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        create: {
          id: 'user-id',
          fullName: 'Test User',
          description: '',
          location: '',
          isClub: false,
          phone: null,
          email: 'test@example.com',
          availability: [],
          amenities: {},
        },
        update: {
          email: 'test@example.com',
          fullName: 'Test User',
        },
      });
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        select: { isClub: true },
      });
    });

    it('should call profile lookup for app client on success', async () => {
      const dto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
        client: 'app',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User', is_club: false },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      await service.signIn(dto);

      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        select: { isClub: true },
      });
    });

    it('should forbid app client when user_metadata is_club is true', async () => {
      const dto: SignInDto = {
        email: 'club@example.com',
        password: 'Password123!',
        client: 'app',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'club-id',
        email: dto.email,
        user_metadata: { is_club: true, full_name: 'Club' },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(prisma.profile.upsert).not.toHaveBeenCalled();
    });

    it('should forbid app client when profile.isClub is true', async () => {
      const dto: SignInDto = {
        email: 'x@example.com',
        password: 'Password123!',
        client: 'app',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'u1',
        email: dto.email,
        user_metadata: { full_name: 'X', is_club: false },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      (prisma.profile.findUnique as jest.Mock).mockResolvedValueOnce({
        isClub: true,
      });

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(prisma.profile.upsert).not.toHaveBeenCalled();
    });

    it('should allow club user when client is backoffice', async () => {
      const dto: SignInDto = {
        email: 'club@example.com',
        password: 'Password123!',
        client: 'backoffice',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'club-id',
        email: dto.email,
        user_metadata: { is_club: true, full_name: 'Club' },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      await service.signIn(dto);

      expect(prisma.profile.findUnique).not.toHaveBeenCalled();
      expect(prisma.profile.upsert).toHaveBeenCalled();
    });

    it('should allow club user when client is omitted (backoffice default)', async () => {
      const dto: SignInDto = {
        email: 'club@example.com',
        password: 'Password123!',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'club-id',
        email: dto.email,
        user_metadata: { is_club: true, full_name: 'Club' },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      await service.signIn(dto);

      expect(prisma.profile.findUnique).not.toHaveBeenCalled();
    });

    it('should forbid backoffice client for app user', async () => {
      const dto: SignInDto = {
        email: 'player@example.com',
        password: 'Password123!',
        client: 'backoffice',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'player-id',
        email: dto.email,
        user_metadata: { is_club: false, full_name: 'Player' },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      (prisma.profile.findUnique as jest.Mock).mockResolvedValueOnce({
        isClub: false,
      });

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(prisma.profile.upsert).not.toHaveBeenCalled();
    });

    it('should forbid app client for super_admin role', async () => {
      const dto: SignInDto = {
        email: 'admin@example.com',
        password: 'Password123!',
        client: 'app',
      } as SignInDto;

      const session = {
        access_token: 'access',
        refresh_token: 'refresh',
      };
      const user = {
        id: 'admin-id',
        email: dto.email,
        user_metadata: { full_name: 'Admin' },
        app_metadata: { roles: ['super_admin'] },
      } as any;

      client.auth.signInWithPassword.mockResolvedValue({
        data: { session, user },
        error: null,
      });

      await expect(service.signIn(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(prisma.profile.upsert).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when session is missing', async () => {
      client.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      });

      await expect(service.signIn({} as SignInDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should succeed when resetPasswordForEmail has no error', async () => {
      client.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await service.forgotPassword('test@example.com');

      expect(client.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'https://backoffice-iota-neon.vercel.app',
        },
      );
      expect(result.message).toContain('password reset link');
    });

    it('should use app deeplink redirect for app client', async () => {
      client.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      await service.forgotPassword('test@example.com', 'app');

      expect(client.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'exp://127.0.0.1:8081/--/login',
        },
      );
    });

    it('should throw UnauthorizedException on error', async () => {
      client.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: { message: 'boom' },
      });

      await expect(service.forgotPassword('x')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const dto: ChangePasswordDto = {
        currentPassword: 'old',
        newPassword: 'new',
      } as ChangePasswordDto;

      client.auth.signInWithPassword.mockResolvedValue({
        data: {},
        error: null,
      });
      client.auth.admin.updateUserById.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await service.changePassword('user-id', 'mail', dto);

      expect(client.auth.signInWithPassword).toHaveBeenCalled();
      expect(client.auth.admin.updateUserById).toHaveBeenCalledWith('user-id', {
        password: dto.newPassword,
      });
      expect(result.message).toContain('Password changed successfully');
    });

    it('should throw BadRequestException if current password is wrong', async () => {
      client.auth.signInWithPassword.mockResolvedValue({
        data: {},
        error: { message: 'invalid' },
      });

      await expect(
        service.changePassword('u', 'e', {
          currentPassword: 'x',
          newPassword: 'y',
        } as ChangePasswordDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if update fails', async () => {
      client.auth.signInWithPassword.mockResolvedValue({
        data: {},
        error: null,
      });
      client.auth.admin.updateUserById.mockResolvedValue({
        data: {},
        error: { message: 'update failed' },
      });

      await expect(
        service.changePassword('u', 'e', {
          currentPassword: 'x',
          newPassword: 'y',
        } as ChangePasswordDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      client.auth.admin.deleteUser.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await service.deleteAccount('user-id');

      expect(client.auth.admin.deleteUser).toHaveBeenCalledWith('user-id');
      expect(result.message).toContain('Account deleted successfully');
    });

    it('should throw BadRequestException on error', async () => {
      client.auth.admin.deleteUser.mockResolvedValue({
        data: {},
        error: { message: 'failed' },
      });

      await expect(service.deleteAccount('u')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
