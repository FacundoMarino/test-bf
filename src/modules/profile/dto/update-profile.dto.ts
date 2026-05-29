import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsObject,
  Matches,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilitySlotDto {
  @IsString()
  day: string;

  /** Formato legacy; opcional si se envían `startTime` / `endTime` / `slotDurationMinutes`. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  timeSlots?: string[];

  /** Hora de apertura, 24 h (`HH:mm`). */
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  /** Hora de cierre, 24 h (`HH:mm`). */
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;

  /** Duración de cada turno en minutos (ej. 60, 90). */
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(24 * 60)
  slotDurationMinutes?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsObject()
  amenities?: Record<string, boolean>;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  level?: number;

  @IsOptional()
  @IsIn(['derecha', 'izquierda', 'ambos'])
  preferredPosition?: string;

  @IsOptional()
  @IsIn(['indoor', 'outdoor', 'ambas'])
  courtType?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availability?: AvailabilitySlotDto[];

  @IsOptional()
  @IsBoolean()
  isClub?: boolean;
}
