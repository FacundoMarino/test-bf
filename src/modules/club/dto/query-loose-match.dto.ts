import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryLooseMatchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['indoor', 'outdoor'])
  courtType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  /** Organizador con la misma `location` en perfil que el usuario, sin los tuyos ni participación previa. */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return undefined;
  })
  sameCity?: boolean;
}
