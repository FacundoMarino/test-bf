import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryMatchDto {
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

  /** Solo partidos públicos en clubes con la misma ciudad (`clubs.location` = tu perfil), próximos días, sin los tuyos ni los que ya integras. */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return undefined;
  })
  forYou?: boolean;

  /** Si está definido (p. ej. 4), solo partidos con `start` entre ahora y el final de ese día. */
  @IsOptional()
  @IsInt()
  @Min(1)
  withinDays?: number;
}
