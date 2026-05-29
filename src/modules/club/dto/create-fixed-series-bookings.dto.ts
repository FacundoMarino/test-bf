import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';

/** Día y hora local de inicio de cada ocurrencia; se repite semanalmente. */
export class CreateFixedSeriesBookingsDto {
  /** Primer día de la serie (fecha local YYYY-MM-DD). */
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  /** Fin inclusive de la serie. Si se omite, se usa startDate + 10 años. */
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate?: string;

  /** 0 = Sunday, …, 6 = Saturday — debe coincidir con startDate. */
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  /** Minutos desde medianoche (ej. 15*60+40 = 940 para 15:40). */
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  startTimeMinutes: number;

  @IsInt()
  @Min(1)
  @Max(24 * 60)
  durationMinutes: number;

  /** Solo lectura: conflictos y recuento, sin escribir en BBDD. */
  @IsOptional()
  @IsBoolean()
  preview?: boolean;

  /**
   * Obligatorio cuando hay solapes con reservas que no bloquean (p. ej. partido público tentativo).
   * No elimina reservas que ocupen slot (bloqueadas aparte).
   */
  @IsOptional()
  @IsBoolean()
  confirmRemoveOverlapping?: boolean;

  /** Cliente del turno fijo (se guarda en manualGuests). */
  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
