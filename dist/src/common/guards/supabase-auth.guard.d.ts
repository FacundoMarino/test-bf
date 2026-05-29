import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../supabase/supabase.service';
export interface RequestWithUser extends Request {
    user?: User | null;
    accessToken?: string;
}
export declare class SupabaseAuthGuard implements CanActivate {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
