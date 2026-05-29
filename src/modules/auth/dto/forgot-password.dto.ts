import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['app', 'backoffice'])
  client?: 'app' | 'backoffice';
}
