import { IsString, Matches } from 'class-validator';

export class QueryCourtExceptionsDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/)
  month: string;
}
