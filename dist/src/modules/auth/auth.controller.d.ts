import type { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(body: SignUpDto): Promise<{
        user: User | null;
        message: string;
    }>;
    signIn(body: SignInDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
    refresh(body: RefreshSessionDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User | null;
    }>;
    forgotPassword(body: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    me(user: User | null): {
        user: User | null;
    };
    changePassword(user: User, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccount(user: User): Promise<{
        message: string;
    }>;
    adminOnly(user: User | null): {
        user: User | null;
        message: string;
    };
}
