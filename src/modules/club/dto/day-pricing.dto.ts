import { IsString, IsNumber, Min } from 'class-validator';

export class DayPricingDto {
  @IsString()
  day: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerHour: number;
}
