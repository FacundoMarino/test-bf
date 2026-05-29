import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateCourtScheduleDto } from './create-court-schedule.dto';

export class ReplaceCourtSchedulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourtScheduleDto)
  schedules: CreateCourtScheduleDto[];

  @IsOptional()
  @IsBoolean()
  /** Si es true, cancela (CANCELLED) las reservas activas que ya no encajan en los nuevos horarios antes de reemplazar. */
  confirmCancelAffectedBookings?: boolean;
}
