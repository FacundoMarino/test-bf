import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateLooseMatchDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  startLabel!: string; // Ej: "09:00"

  @IsInt()
  @Min(1)
  @Max(8)
  level!: number;

  @IsIn(['indoor', 'outdoor'])
  courtType!: 'indoor' | 'outdoor';
}
