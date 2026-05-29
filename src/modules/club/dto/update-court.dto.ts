import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCourtDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['indoor', 'outdoor', 'unspecified'])
  type?: string;

  @IsOptional()
  @IsString()
  surface?: string;

  @IsOptional()
  @IsBoolean()
  lighting?: boolean;

  @IsOptional()
  @IsBoolean()
  listed?: boolean;
}
