import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RequestWithUser } from './supabase-auth.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  const createContext = (user: any): ExecutionContext =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () =>
          ({
            user,
          }) as unknown as RequestWithUser,
      }),
    }) as any;

  it('should allow if no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const ctx = createContext({});
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow if user has required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    const ctx = createContext({ app_metadata: { roles: ['admin'] } });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should throw ForbiddenException if user lacks role', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    const ctx = createContext({ app_metadata: { roles: ['user'] } });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
