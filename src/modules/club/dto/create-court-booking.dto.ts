import {
  Allow,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCourtBookingDto {
  @IsDateString()
  start: string; // ISO datetime

  /**
   * Duración en minutos. Si se omite, se usa la duración del slot del schedule.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24 * 60)
  durationMinutes?: number;

  /**
   * [{ name, phone? }] — validación en ClubService (evita fallos de ValidateNested con JSON plano).
   * Solo persiste si el dueño del club (assertClubOwner).
   */
  @IsOptional()
  @Allow()
  manualGuests?: unknown;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  manualNotes?: string;
}
