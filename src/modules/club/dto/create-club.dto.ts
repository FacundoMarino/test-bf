import {
  IsString,
  IsInt,
  Min,
  IsIn,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayPricingDto } from './day-pricing.dto';

export class CreateClubDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  courtCount: number;

  @IsIn(['indoor', 'outdoor', 'both'])
  courtType: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  web?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayPricingDto)
  pricing: DayPricingDto[];
}
