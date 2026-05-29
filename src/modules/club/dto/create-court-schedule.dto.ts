import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCourtScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...

  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  startTimeMinutes: number;

  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  endTimeMinutes: number;

  @IsInt()
  @Min(1)
  @Max(8 * 60)
  slotDurationMinutes: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerHour?: number;

  @IsOptional()
  @IsString()
  periodName?: string;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;
}
