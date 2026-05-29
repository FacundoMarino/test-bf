import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard, RequestWithUser } from './supabase-auth.guard';
import { SupabaseService } from '../../supabase/supabase.service';

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let supabaseService: jest.Mocked<SupabaseService>;
  let client: any;

  beforeEach(() => {
    client = {
      auth: {
        getUser: jest.fn(),
      },
    };

    supabaseService = {
      getClient: jest.fn().mockReturnValue(client),
    } as any;

    guard = new SupabaseAuthGuard(supabaseService);
  });

  const createContext = (headers: Record<string, string>): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () =>
          ({
            headers,
          }) as unknown as RequestWithUser,
      }),
    }) as any;

  it('should throw if Authorization header is missing', async () => {
    const ctx = createContext({});

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw if Authorization format is invalid', async () => {
    const ctx = createContext({ authorization: 'invalid' });

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw if token is invalid', async () => {
    const ctx = createContext({ authorization: 'Bearer token' });
    client.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid' },
    });

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should attach user and accessToken and return true', async () => {
    const request: RequestWithUser = {
      headers: { authorization: 'Bearer token' },
    } as any;

    const ctx: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    const user = { id: 'u' };
    client.auth.getUser.mockResolvedValue({
      data: { user },
      error: null,
    });

    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(request.user).toBe(user);
    expect(request.accessToken).toBe('token');
  });
});
