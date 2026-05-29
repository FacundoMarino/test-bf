import type { User } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
export declare class AuthService {
    private readonly supabaseService;
    private readonly prisma;
    constructor(supabaseService: SupabaseService, prisma: PrismaService);
    private getRequiredEnv;
    private resolveSupabaseRedirectUrl;
    private resolveSignUpRedirectUrl;
    private syncProfileFromAuth;
    private assertMobileAppAllowed;
    private assertBackofficeAllowed;
    private assertSignUpClientConsistency;
    signUp(payload: SignUpDto): Promise<{
        user: User | null;
        message: string;
    }>;
    signIn(payload: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    forgotPassword(email: string, authClient?: 'app' | 'backoffice'): Promise<{
        message: string;
    }>;
    changePassword(userId: string, userEmail: string | undefined, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    refreshSession(body: RefreshSessionDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User | null;
    }>;
}
