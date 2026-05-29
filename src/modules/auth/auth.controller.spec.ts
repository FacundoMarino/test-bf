jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      forgotPassword: jest.fn(),
      changePassword: jest.fn(),
      deleteAccount: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    controller = new AuthController(authService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.signUp', async () => {
    const dto = { email: 'a', password: 'b' } as SignUpDto;
    const response = { ok: true };
    authService.signUp.mockResolvedValue(response as any);

    const result = await controller.signUp(dto);

    expect(authService.signUp).toHaveBeenCalledWith(dto);
    expect(result).toBe(response);
  });

  it('should call authService.signIn', async () => {
    const dto = { email: 'a', password: 'b' } as SignInDto;
    const response = { token: 'x' };
    authService.signIn.mockResolvedValue(response as any);

    const result = await controller.signIn(dto);

    expect(authService.signIn).toHaveBeenCalledWith(dto);
    expect(result).toBe(response);
  });

  it('should call authService.forgotPassword', async () => {
    const dto = { email: 'a@b.com' } as ForgotPasswordDto;
    const response = { message: 'ok' };
    authService.forgotPassword.mockResolvedValue(response as any);

    const result = await controller.forgotPassword(dto);

    expect(authService.forgotPassword).toHaveBeenCalledWith(
      dto.email,
      dto.client,
    );
    expect(result).toBe(response);
  });

  it('should call authService.changePassword', async () => {
    const user = { id: 'u', email: 'e' } as any;
    const dto = {
      currentPassword: 'old',
      newPassword: 'new',
    } as ChangePasswordDto;
    const response = { message: 'ok' };
    authService.changePassword.mockResolvedValue(response as any);

    const result = await controller.changePassword(user, dto);

    expect(authService.changePassword).toHaveBeenCalledWith(
      user.id,
      user.email,
      dto,
    );
    expect(result).toBe(response);
  });

  it('should call authService.deleteAccount', async () => {
    const user = { id: 'u' } as any;
    const response = { message: 'deleted' };
    authService.deleteAccount.mockResolvedValue(response as any);

    const result = await controller.deleteAccount(user);

    expect(authService.deleteAccount).toHaveBeenCalledWith(user.id);
    expect(result).toBe(response);
  });

  it('adminOnly should return user and message', () => {
    const user = {
      id: 'u',
      app_metadata: { roles: ['admin'] },
    } as any;

    const result = controller.adminOnly(user);

    expect(result).toEqual({
      user,
      message: 'You have admin access',
    });
  });
});
