import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @IsString()
  title: string;

  @IsUUID()
  courtId: string;

  @IsString()
  start: string; // ISO datetime

  @IsInt()
  @Min(2)
  @Max(4)
  maxPlayers: number;

  @IsInt()
  @Min(1)
  @Max(8)
  level: number;

  @IsOptional()
  @IsIn(['indoor', 'outdoor'])
  courtType?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'mixed'])
  matchGender?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
