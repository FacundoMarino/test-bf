import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { QueryClubDto } from './dto/query-club.dto';
import { CreateCourtDto } from './dto/create-court.dto';
import { QueryCourtDto } from './dto/query-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { CreateCourtScheduleDto } from './dto/create-court-schedule.dto';
import { ReplaceCourtSchedulesDto } from './dto/replace-court-schedules.dto';
import { QueryCourtSlotsDto } from './dto/query-court-slots.dto';
import { QueryCourtExceptionsDto } from './dto/query-court-exceptions.dto';
import { ReplaceCourtExceptionsDto } from './dto/replace-court-exceptions.dto';
import { CreateCourtCustomSlotDto } from './dto/create-court-custom-slot.dto';
import { CreateCourtBookingDto } from './dto/create-court-booking.dto';
import { CreateFixedSeriesBookingsDto } from './dto/create-fixed-series-bookings.dto';
import { QueryClubBookingsDto } from './dto/query-club-bookings.dto';
import { QueryClubDashboardDto } from './dto/query-club-dashboard.dto';
import { QueryClubAnalyticsDto } from './dto/query-club-analytics.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { QueryMatchDto } from './dto/query-match.dto';
import { CreateLooseMatchDto } from './dto/create-loose-match.dto';
import { QueryLooseMatchDto } from './dto/query-loose-match.dto';
import { CreateBoardMessageDto } from './dto/create-board-message.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('clubs')
@UseGuards(SupabaseAuthGuard)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  async create(@CurrentUser() user: User, @Body() dto: CreateClubDto) {
    return this.clubService.create(dto, user.id);
  }

  @Get()
  async findAll(@Query() query: QueryClubDto) {
    return this.clubService.findAll(query);
  }

  @Get('admin')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  async listClubsForAdmin(
    @Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED',
  ) {
    return this.clubService.listClubsForAdmin(status);
  }

  @Patch('admin/:clubId/approve')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  async approveClub(@Param('clubId', ParseUUIDPipe) clubId: string) {
    return this.clubService.approveClub(clubId);
  }

  @Patch('admin/:clubId/reject')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  async rejectClub(@Param('clubId', ParseUUIDPipe) clubId: string) {
    return this.clubService.rejectClub(clubId);
  }

  @Get('me')
  async findMyClub(@CurrentUser() user: User) {
    return this.clubService.findMine(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clubService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClubDto,
    @CurrentUser() user: User,
  ) {
    return this.clubService.update(id, dto, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.remove(id, user.id);
  }

  @Post(':clubId/courts')
  async createCourt(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Body() dto: CreateCourtDto,
  ) {
    return this.clubService.createCourt(clubId, dto);
  }

  @Get(':clubId/courts')
  async findCourts(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Query() query: QueryCourtDto,
    @CurrentUser() user: User,
  ) {
    return this.clubService.findCourts(clubId, query, user.id);
  }

  @Patch(':clubId/courts/:courtId')
  async updateCourt(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Body() dto: UpdateCourtDto,
  ) {
    return this.clubService.updateCourt(clubId, courtId, dto);
  }

  @Delete(':clubId/courts/:courtId')
  async removeCourt(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
  ) {
    return this.clubService.removeCourt(clubId, courtId);
  }

  @Post(':clubId/courts/:courtId/schedules')
  async createCourtSchedule(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Body() dto: CreateCourtScheduleDto,
  ) {
    return this.clubService.createCourtSchedule(clubId, courtId, dto);
  }

  @Get(':clubId/courts/:courtId/schedules')
  async listCourtSchedules(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
  ) {
    return this.clubService.listCourtSchedules(clubId, courtId);
  }

  @Put(':clubId/courts/:courtId/schedules')
  async replaceCourtSchedules(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Body() dto: ReplaceCourtSchedulesDto,
  ) {
    return this.clubService.replaceCourtSchedules(
      clubId,
      courtId,
      dto.schedules,
      dto.confirmCancelAffectedBookings === true,
    );
  }

  @Get(':clubId/courts/:courtId/slots')
  async listCourtSlots(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Query() query: QueryCourtSlotsDto,
    @CurrentUser() user: User,
  ) {
    return this.clubService.listCourtSlots(clubId, courtId, query, user.id);
  }

  @Get(':clubId/courts/:courtId/availability-exceptions')
  async listCourtAvailabilityExceptions(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Query() query: QueryCourtExceptionsDto,
  ) {
    return this.clubService.listCourtAvailabilityExceptions(
      clubId,
      courtId,
      query.month,
    );
  }

  @Put(':clubId/courts/:courtId/availability-exceptions')
  async replaceCourtAvailabilityExceptions(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Body() dto: ReplaceCourtExceptionsDto,
  ) {
    return this.clubService.replaceCourtAvailabilityExceptions(
      clubId,
      courtId,
      dto.month,
      dto.exceptions,
    );
  }

  @Get(':clubId/courts/:courtId/custom-slots')
  async listCourtCustomSlots(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Query() query: QueryCourtExceptionsDto,
  ) {
    return this.clubService.listCourtCustomSlots(
      clubId,
      courtId,
      query.month,
    );
  }

  @Post(':clubId/courts/:courtId/custom-slots')
  async createCourtCustomSlot(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCourtCustomSlotDto,
  ) {
    return this.clubService.createCourtCustomSlot(
      clubId,
      courtId,
      user.id,
      dto,
    );
  }

  @Delete(':clubId/courts/:courtId/custom-slots/:slotId')
  async deleteCourtCustomSlot(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @Param('slotId', ParseUUIDPipe) slotId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.deleteCourtCustomSlot(
      clubId,
      courtId,
      slotId,
      user.id,
    );
  }

  @Post(':clubId/courts/:courtId/bookings/fixed-series')
  async createFixedSeriesBookings(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateFixedSeriesBookingsDto,
  ) {
    return this.clubService.createFixedSeriesBookings(
      clubId,
      courtId,
      user.id,
      dto,
    );
  }

  @Post(':clubId/courts/:courtId/bookings')
  async createCourtBooking(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('courtId', ParseUUIDPipe) courtId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCourtBookingDto,
  ) {
    return this.clubService.createCourtBooking(clubId, courtId, user.id, dto);
  }

  @Patch(':clubId/bookings/:bookingId/approve')
  async approveCourtBooking(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.approveCourtBooking(clubId, bookingId, user.id);
  }

  @Patch(':clubId/bookings/:bookingId/reject')
  async rejectCourtBooking(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.rejectCourtBooking(clubId, bookingId, user.id);
  }

  @Patch(':clubId/bookings/:bookingId/cancel')
  async cancelCourtBooking(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.cancelCourtBooking(clubId, bookingId, user.id);
  }

  @Get(':clubId/bookings')
  async listClubBookings(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @CurrentUser() user: User,
    @Query() query: QueryClubBookingsDto,
  ) {
    return this.clubService.listClubBookings(clubId, user.id, query);
  }

  @Get(':clubId/dashboard')
  async getClubDashboard(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @CurrentUser() user: User,
    @Query() query: QueryClubDashboardDto,
  ) {
    return this.clubService.getClubDashboard(clubId, user.id, query);
  }

  @Get(':clubId/analytics')
  async getClubAnalytics(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @CurrentUser() user: User,
    @Query() query: QueryClubAnalyticsDto,
  ) {
    return this.clubService.getClubAnalytics(clubId, user.id, query);
  }

  @Get('me/bookings')
  async listMyBookings(@CurrentUser() user: User) {
    return this.clubService.listUserBookings(user.id);
  }

  // Alias no ambiguo para evitar colisión con ':id'
  @Get('bookings/me')
  async listMyBookingsAlias(@CurrentUser() user: User) {
    return this.clubService.listUserBookings(user.id);
  }

  @Get('bookings/:bookingId/invite-code')
  async getBookingInviteCode(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: User,
  ) {
    const inviteCode = await this.clubService.getBookingInviteCode(
      bookingId,
      user.id,
    );
    return { inviteCode };
  }

  @Get('invites/:code')
  async resolveInvite(@Param('code') code: string, @CurrentUser() user: User) {
    return this.clubService.resolveInvite(code, user.id);
  }

  @Post('invites/:code/join')
  async joinInvite(@Param('code') code: string, @CurrentUser() user: User) {
    return this.clubService.joinInvite(code, user.id);
  }

  @Post('loose-matches')
  async createLooseMatch(
    @CurrentUser() user: User,
    @Body() dto: CreateLooseMatchDto,
  ) {
    return this.clubService.createLooseMatch(user.id, dto);
  }

  @Get('me/loose-matches')
  async findMyLooseMatches(
    @CurrentUser() user: User,
    @Query() query: QueryLooseMatchDto,
  ) {
    return this.clubService.findMyLooseMatches(user.id, query);
  }

  @Get('loose-matches/public')
  async findLooseMatches(
    @CurrentUser() user: User,
    @Query() query: QueryLooseMatchDto,
  ) {
    return this.clubService.findLooseMatches(user.id, query);
  }

  @Get('loose-matches/:matchId/board-messages')
  async listLooseMatchBoardMessages(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.listLooseMatchBoardMessages(matchId, user.id);
  }

  @Post('loose-matches/:matchId/board-messages')
  async postLooseMatchBoardMessage(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateBoardMessageDto,
  ) {
    return this.clubService.postLooseMatchBoardMessage(
      matchId,
      user.id,
      dto.body,
    );
  }

  @Delete('loose-matches/:matchId/board-messages/:messageId')
  async deleteLooseMatchBoardMessage(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.deleteLooseMatchBoardMessage(
      matchId,
      messageId,
      user.id,
    );
  }

  @Get('loose-matches/:matchId')
  async findLooseMatchDetail(@Param('matchId', ParseUUIDPipe) matchId: string) {
    return this.clubService.findLooseMatchDetail(matchId);
  }

  @Post('loose-matches/:matchId/join')
  async joinLooseMatch(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.joinLooseMatch(matchId, user.id);
  }

  @Post('loose-matches/:matchId/leave')
  async leaveLooseMatch(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.leaveLooseMatch(matchId, user.id);
  }

  @Post(':clubId/matches')
  async createMatch(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateMatchDto,
  ) {
    return this.clubService.createMatch(clubId, user.id, dto);
  }

  @Get('all/matches')
  async findPublicMatches(
    @CurrentUser() user: User,
    @Query() query: QueryMatchDto,
  ) {
    return this.clubService.findPublicMatches(user.id, query);
  }

  @Get('matches/public')
  async findPublicMatchesAlias(
    @CurrentUser() user: User,
    @Query() query: QueryMatchDto,
  ) {
    return this.clubService.findPublicMatches(user.id, query);
  }

  @Get('me/matches')
  async findMyMatches(
    @CurrentUser() user: User,
    @Query() query: QueryMatchDto,
  ) {
    return this.clubService.findMyMatches(user.id, query);
  }

  @Get('matches/me')
  async findMyMatchesAlias(
    @CurrentUser() user: User,
    @Query() query: QueryMatchDto,
  ) {
    return this.clubService.findMyMatches(user.id, query);
  }

  @Get('matches/:matchId/board-messages')
  async listCourtBookingBoardMessages(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.listCourtBookingBoardMessages(matchId, user.id);
  }

  @Post('matches/:matchId/board-messages')
  async postCourtBookingBoardMessage(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateBoardMessageDto,
  ) {
    return this.clubService.postCourtBookingBoardMessage(
      matchId,
      user.id,
      dto.body,
    );
  }

  @Delete('matches/:matchId/board-messages/:messageId')
  async deleteCourtBookingBoardMessage(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.deleteCourtBookingBoardMessage(
      matchId,
      messageId,
      user.id,
    );
  }

  @Get('matches/:matchId')
  async findMatchDetail(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.findMatchDetail(matchId, user.id);
  }

  @Get(':clubId/matches')
  async findMatches(
    @Param('clubId', ParseUUIDPipe) clubId: string,
    @Query() query: QueryMatchDto,
  ) {
    return this.clubService.findMatches(clubId, query);
  }

  @Post('matches/:matchId/join')
  async joinMatch(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.joinMatch(matchId, user.id);
  }

  @Post('matches/:matchId/leave')
  async leaveMatch(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: User,
  ) {
    return this.clubService.leaveMatch(matchId, user.id);
  }
}
