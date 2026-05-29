import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshSessionDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;

  @IsOptional()
  @IsIn(['app', 'backoffice'])
  client?: 'app' | 'backoffice';
}
