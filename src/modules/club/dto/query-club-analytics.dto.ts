import { IsIn, IsOptional } from 'class-validator';

export class QueryClubAnalyticsDto {
  @IsOptional()
  @IsIn(['week', 'month', 'year'])
  range?: 'week' | 'month' | 'year';
}
