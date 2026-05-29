import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class CancelledSlotRangeDto {
  @IsInt()
  @Min(0)
  startTimeMinutes: number;

  @IsInt()
  @Min(1)
  endTimeMinutes: number;
}

export class CreateCourtCustomSlotDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  startTimeMinutes: number;

  @IsInt()
  @Min(1)
  @Max(24 * 60)
  endTimeMinutes: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  /**
   * Turnos cancelados en el modal que aún no se guardaron con "Listo".
   * Se usan para validar el custom y se persisten junto con la creación.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CancelledSlotRangeDto)
  cancelledSlots?: CancelledSlotRangeDto[];
}
