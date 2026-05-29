import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../supabase/supabase.service';

export interface RequestWithUser extends Request {
  user?: User | null;
  accessToken?: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser>();

    const authHeader =
      request.headers['authorization'] ?? request.headers['Authorization'];
    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = data.user;
    request.accessToken = token;

    return true;
  }
}
