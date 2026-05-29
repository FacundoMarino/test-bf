import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  /**
   * `app` = jugador (móvil). `backoffice` = panel sass / club.
   * Si se omite se trata como backoffice (compatibilidad con clientes antiguos).
   */
  @IsOptional()
  @IsIn(['app', 'backoffice'])
  client?: 'app' | 'backoffice';
}
