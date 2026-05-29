import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBoardMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body!: string;
}
