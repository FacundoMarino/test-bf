import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsIn(['indoor', 'outdoor', 'unspecified'])
  type: string;

  @IsString()
  surface: string;

  @IsBoolean()
  lighting: boolean;

  @IsOptional()
  @IsBoolean()
  /** Por defecto true en DB; si false, no aparece para reservas públicas. */
  listed?: boolean;
}
