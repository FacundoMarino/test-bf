import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

class CourtExceptionDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  isClosedAllDay: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  startTimeMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  endTimeMinutes?: number;
}

export class ReplaceCourtExceptionsDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/)
  month: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourtExceptionDto)
  exceptions: CourtExceptionDto[];
}
