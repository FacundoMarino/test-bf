"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const supabase_service_1 = require("../../supabase/supabase.service");
const STAFF_ROLES_BLOCKED_ON_APP = new Set(['super_admin', 'admin']);
const MSG_APP_FORBIDDEN_CLUB = 'Esta cuenta es para el panel de clubes. Usá la web para gestionar tu club o registrate como jugador en la app.';
const MSG_APP_FORBIDDEN_STAFF = 'Esta cuenta no tiene acceso a la aplicación móvil.';
const MSG_BACKOFFICE_FORBIDDEN = 'Esta cuenta no tiene acceso.';
let AuthService = class AuthService {
    supabaseService;
    prisma;
    constructor(supabaseService, prisma) {
        this.supabaseService = supabaseService;
        this.prisma = prisma;
    }
    getRequiredEnv(name) {
        const value = process.env[name]?.trim();
        if (!value) {
            throw new common_1.InternalServerErrorException(`Missing required environment variable: ${name}`);
        }
        return value;
    }
    resolveSupabaseRedirectUrl(client) {
        if (client === 'app') {
            return this.getRequiredEnv('APP_SUPABASE_REDIRECT_URL');
        }
        return this.getRequiredEnv('BACKOFFICE_SUPABASE_REDIRECT_URL');
    }
    resolveSignUpRedirectUrl(client) {
        const baseUrl = this.getRequiredEnv('ACCOUNT_CONFIRMATION_URL');
        const target = client === 'app'
            ? this.getRequiredEnv('APP_SUPABASE_REDIRECT_URL')
            : this.getRequiredEnv('BACKOFFICE_SUPABASE_REDIRECT_URL');
        const url = new URL(baseUrl);
        url.searchParams.set('client', client === 'app' ? 'app' : 'backoffice');
        url.searchParams.set('target', target);
        return url.toString();
    }
    async syncProfileFromAuth(params) {
        const email = params.email?.trim() || null;
        const fullName = params.fullName?.trim() || null;
        const updateData = {
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
    async assertMobileAppAllowed(user, client) {
        if (client !== 'app') {
            return;
        }
        const meta = (user.user_metadata ?? {});
        if (meta.is_club === true) {
            throw new common_1.ForbiddenException(MSG_APP_FORBIDDEN_CLUB);
        }
        const rolesUnknown = user.app_metadata
            ?.roles;
        if (Array.isArray(rolesUnknown)) {
            const blocked = rolesUnknown.some((r) => typeof r === 'string' && STAFF_ROLES_BLOCKED_ON_APP.has(r));
            if (blocked) {
                throw new common_1.ForbiddenException(MSG_APP_FORBIDDEN_STAFF);
            }
        }
        if (user.id) {
            const profile = await this.prisma.profile.findUnique({
                where: { id: user.id },
                select: { isClub: true },
            });
            if (profile?.isClub === true) {
                throw new common_1.ForbiddenException(MSG_APP_FORBIDDEN_CLUB);
            }
        }
    }
    async assertBackofficeAllowed(user, client) {
        if (client === 'app') {
            return;
        }
        const meta = (user.user_metadata ?? {});
        if (meta.is_club === true) {
            return;
        }
        const rolesUnknown = user.app_metadata
            ?.roles;
        if (Array.isArray(rolesUnknown)) {
            const hasStaffRole = rolesUnknown.some((r) => typeof r === 'string' && STAFF_ROLES_BLOCKED_ON_APP.has(r));
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
        throw new common_1.ForbiddenException(MSG_BACKOFFICE_FORBIDDEN);
    }
    assertSignUpClientConsistency(payload) {
        if (payload.client === 'app' && payload.isClub === true) {
            throw new common_1.ForbiddenException('Las cuentas de club deben registrarse desde el backoffice.');
        }
        if (payload.client === 'backoffice' && payload.isClub !== true) {
            throw new common_1.ForbiddenException('El registro en backoffice solo permite cuentas de club.');
        }
    }
    async signUp(payload) {
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
            throw new common_1.UnauthorizedException(error.message);
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
            message: 'User registered successfully. Please confirm your email if required.',
        };
    }
    async signIn(payload) {
        const client = this.supabaseService.getClient();
        const { data, error } = await client.auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });
        if (error || !data.session) {
            throw new common_1.UnauthorizedException(error?.message ?? 'Invalid credentials');
        }
        if (data.user) {
            await this.assertMobileAppAllowed(data.user, payload.client);
            await this.assertBackofficeAllowed(data.user, payload.client);
        }
        if (data.user?.id) {
            const metadata = (data.user.user_metadata ?? {});
            await this.syncProfileFromAuth({
                userId: data.user.id,
                email: data.user.email ?? payload.email,
                fullName: typeof metadata.full_name === 'string' ? metadata.full_name : null,
                isClub: metadata.is_club === true,
            });
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: data.user,
        };
    }
    async forgotPassword(email, authClient) {
        const client = this.supabaseService.getClient();
        const redirectTo = this.resolveSupabaseRedirectUrl(authClient);
        const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo,
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        return {
            message: 'If an account exists with this email, you will receive a password reset link.',
        };
    }
    async changePassword(userId, userEmail, dto) {
        if (!userEmail) {
            throw new common_1.BadRequestException('User email is missing');
        }
        const client = this.supabaseService.getClient();
        const { error: signInError } = await client.auth.signInWithPassword({
            email: userEmail,
            password: dto.currentPassword,
        });
        if (signInError) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const { error: updateError } = await client.auth.admin.updateUserById(userId, { password: dto.newPassword });
        if (updateError) {
            throw new common_1.BadRequestException(updateError.message);
        }
        return { message: 'Password changed successfully' };
    }
    async deleteAccount(userId) {
        const client = this.supabaseService.getClient();
        const { error } = await client.auth.admin.deleteUser(userId);
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return { message: 'Account deleted successfully' };
    }
    async refreshSession(body) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: body.refreshToken,
        });
        if (error || !data.session) {
            throw new common_1.UnauthorizedException(error?.message ?? 'Session refresh failed');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map