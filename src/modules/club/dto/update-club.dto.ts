import {
  IsString,
  IsInt,
  Min,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEmail,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayPricingDto } from './day-pricing.dto';

export class UpdateClubDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  courtCount?: number;

  @IsOptional()
  @IsIn(['indoor', 'outdoor', 'both'])
  courtType?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @ValidateIf(
    (o: UpdateClubDto) =>
      typeof o.email === 'string' && o.email.trim().length > 0,
  )
  @IsEmail({}, { message: 'Introduce un email válido' })
  email?: string;

  @IsOptional()
  @ValidateIf(
    (o: UpdateClubDto) => typeof o.web === 'string' && o.web.trim().length > 0,
  )
  @IsString()
  web?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayPricingDto)
  pricing?: DayPricingDto[];

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
