import { IsIn, IsOptional } from 'class-validator';

export class QueryClubDashboardDto {
  @IsOptional()
  @IsIn(['today', 'week', 'month'])
  range?: 'today' | 'week' | 'month';
}
