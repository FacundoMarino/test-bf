import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class QueryCourtSlotsDto {
  @IsDateString()
  date: string; // ISO date (yyyy-mm-dd) or full ISO; se usa solo la parte de fecha

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
