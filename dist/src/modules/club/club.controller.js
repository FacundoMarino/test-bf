"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubController = void 0;
const common_1 = require("@nestjs/common");
const club_service_1 = require("./club.service");
const create_club_dto_1 = require("./dto/create-club.dto");
const update_club_dto_1 = require("./dto/update-club.dto");
const query_club_dto_1 = require("./dto/query-club.dto");
const create_court_dto_1 = require("./dto/create-court.dto");
const query_court_dto_1 = require("./dto/query-court.dto");
const update_court_dto_1 = require("./dto/update-court.dto");
const create_court_schedule_dto_1 = require("./dto/create-court-schedule.dto");
const replace_court_schedules_dto_1 = require("./dto/replace-court-schedules.dto");
const query_court_slots_dto_1 = require("./dto/query-court-slots.dto");
const query_court_exceptions_dto_1 = require("./dto/query-court-exceptions.dto");
const replace_court_exceptions_dto_1 = require("./dto/replace-court-exceptions.dto");
const create_court_custom_slot_dto_1 = require("./dto/create-court-custom-slot.dto");
const create_court_booking_dto_1 = require("./dto/create-court-booking.dto");
const create_fixed_series_bookings_dto_1 = require("./dto/create-fixed-series-bookings.dto");
const query_club_bookings_dto_1 = require("./dto/query-club-bookings.dto");
const query_club_dashboard_dto_1 = require("./dto/query-club-dashboard.dto");
const query_club_analytics_dto_1 = require("./dto/query-club-analytics.dto");
const create_match_dto_1 = require("./dto/create-match.dto");
const query_match_dto_1 = require("./dto/query-match.dto");
const create_loose_match_dto_1 = require("./dto/create-loose-match.dto");
const query_loose_match_dto_1 = require("./dto/query-loose-match.dto");
const create_board_message_dto_1 = require("./dto/create-board-message.dto");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ClubController = class ClubController {
    clubService;
    constructor(clubService) {
        this.clubService = clubService;
    }
    async create(user, dto) {
        return this.clubService.create(dto, user.id);
    }
    async findAll(query) {
        return this.clubService.findAll(query);
    }
    async listClubsForAdmin(status) {
        return this.clubService.listClubsForAdmin(status);
    }
    async approveClub(clubId) {
        return this.clubService.approveClub(clubId);
    }
    async rejectClub(clubId) {
        return this.clubService.rejectClub(clubId);
    }
    async findMyClub(user) {
        return this.clubService.findMine(user.id);
    }
    async findOne(id) {
        return this.clubService.findOne(id);
    }
    async update(id, dto, user) {
        return this.clubService.update(id, dto, user.id);
    }
    async remove(id, user) {
        return this.clubService.remove(id, user.id);
    }
    async createCourt(clubId, dto) {
        return this.clubService.createCourt(clubId, dto);
    }
    async findCourts(clubId, query, user) {
        return this.clubService.findCourts(clubId, query, user.id);
    }
    async updateCourt(clubId, courtId, dto) {
        return this.clubService.updateCourt(clubId, courtId, dto);
    }
    async removeCourt(clubId, courtId) {
        return this.clubService.removeCourt(clubId, courtId);
    }
    async createCourtSchedule(clubId, courtId, dto) {
        return this.clubService.createCourtSchedule(clubId, courtId, dto);
    }
    async listCourtSchedules(clubId, courtId) {
        return this.clubService.listCourtSchedules(clubId, courtId);
    }
    async replaceCourtSchedules(clubId, courtId, dto) {
        return this.clubService.replaceCourtSchedules(clubId, courtId, dto.schedules, dto.confirmCancelAffectedBookings === true);
    }
    async listCourtSlots(clubId, courtId, query, user) {
        return this.clubService.listCourtSlots(clubId, courtId, query, user.id);
    }
    async listCourtAvailabilityExceptions(clubId, courtId, query) {
        return this.clubService.listCourtAvailabilityExceptions(clubId, courtId, query.month);
    }
    async replaceCourtAvailabilityExceptions(clubId, courtId, dto) {
        return this.clubService.replaceCourtAvailabilityExceptions(clubId, courtId, dto.month, dto.exceptions);
    }
    async listCourtCustomSlots(clubId, courtId, query) {
        return this.clubService.listCourtCustomSlots(clubId, courtId, query.month);
    }
    async createCourtCustomSlot(clubId, courtId, user, dto) {
        return this.clubService.createCourtCustomSlot(clubId, courtId, user.id, dto);
    }
    async deleteCourtCustomSlot(clubId, courtId, slotId, user) {
        return this.clubService.deleteCourtCustomSlot(clubId, courtId, slotId, user.id);
    }
    async createFixedSeriesBookings(clubId, courtId, user, dto) {
        return this.clubService.createFixedSeriesBookings(clubId, courtId, user.id, dto);
    }
    async createCourtBooking(clubId, courtId, user, dto) {
        return this.clubService.createCourtBooking(clubId, courtId, user.id, dto);
    }
    async approveCourtBooking(clubId, bookingId, user) {
        return this.clubService.approveCourtBooking(clubId, bookingId, user.id);
    }
    async rejectCourtBooking(clubId, bookingId, user) {
        return this.clubService.rejectCourtBooking(clubId, bookingId, user.id);
    }
    async cancelCourtBooking(clubId, bookingId, user) {
        return this.clubService.cancelCourtBooking(clubId, bookingId, user.id);
    }
    async listClubBookings(clubId, user, query) {
        return this.clubService.listClubBookings(clubId, user.id, query);
    }
    async getClubDashboard(clubId, user, query) {
        return this.clubService.getClubDashboard(clubId, user.id, query);
    }
    async getClubAnalytics(clubId, user, query) {
        return this.clubService.getClubAnalytics(clubId, user.id, query);
    }
    async listMyBookings(user) {
        return this.clubService.listUserBookings(user.id);
    }
    async listMyBookingsAlias(user) {
        return this.clubService.listUserBookings(user.id);
    }
    async getBookingInviteCode(bookingId, user) {
        const inviteCode = await this.clubService.getBookingInviteCode(bookingId, user.id);
        return { inviteCode };
    }
    async resolveInvite(code, user) {
        return this.clubService.resolveInvite(code, user.id);
    }
    async joinInvite(code, user) {
        return this.clubService.joinInvite(code, user.id);
    }
    async createLooseMatch(user, dto) {
        return this.clubService.createLooseMatch(user.id, dto);
    }
    async findMyLooseMatches(user, query) {
        return this.clubService.findMyLooseMatches(user.id, query);
    }
    async findLooseMatches(user, query) {
        return this.clubService.findLooseMatches(user.id, query);
    }
    async listLooseMatchBoardMessages(matchId, user) {
        return this.clubService.listLooseMatchBoardMessages(matchId, user.id);
    }
    async postLooseMatchBoardMessage(matchId, user, dto) {
        return this.clubService.postLooseMatchBoardMessage(matchId, user.id, dto.body);
    }
    async deleteLooseMatchBoardMessage(matchId, messageId, user) {
        return this.clubService.deleteLooseMatchBoardMessage(matchId, messageId, user.id);
    }
    async findLooseMatchDetail(matchId) {
        return this.clubService.findLooseMatchDetail(matchId);
    }
    async joinLooseMatch(matchId, user) {
        return this.clubService.joinLooseMatch(matchId, user.id);
    }
    async leaveLooseMatch(matchId, user) {
        return this.clubService.leaveLooseMatch(matchId, user.id);
    }
    async createMatch(clubId, user, dto) {
        return this.clubService.createMatch(clubId, user.id, dto);
    }
    async findPublicMatches(user, query) {
        return this.clubService.findPublicMatches(user.id, query);
    }
    async findPublicMatchesAlias(user, query) {
        return this.clubService.findPublicMatches(user.id, query);
    }
    async findMyMatches(user, query) {
        return this.clubService.findMyMatches(user.id, query);
    }
    async findMyMatchesAlias(user, query) {
        return this.clubService.findMyMatches(user.id, query);
    }
    async listCourtBookingBoardMessages(matchId, user) {
        return this.clubService.listCourtBookingBoardMessages(matchId, user.id);
    }
    async postCourtBookingBoardMessage(matchId, user, dto) {
        return this.clubService.postCourtBookingBoardMessage(matchId, user.id, dto.body);
    }
    async deleteCourtBookingBoardMessage(matchId, messageId, user) {
        return this.clubService.deleteCourtBookingBoardMessage(matchId, messageId, user.id);
    }
    async findMatchDetail(matchId, user) {
        return this.clubService.findMatchDetail(matchId, user.id);
    }
    async findMatches(clubId, query) {
        return this.clubService.findMatches(clubId, query);
    }
    async joinMatch(matchId, user) {
        return this.clubService.joinMatch(matchId, user.id);
    }
    async leaveMatch(matchId, user) {
        return this.clubService.leaveMatch(matchId, user.id);
    }
};
exports.ClubController = ClubController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_club_dto_1.CreateClubDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_club_dto_1.QueryClubDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listClubsForAdmin", null);
__decorate([
    (0, common_1.Patch)('admin/:clubId/approve'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "approveClub", null);
__decorate([
    (0, common_1.Patch)('admin/:clubId/reject'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "rejectClub", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMyClub", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_club_dto_1.UpdateClubDto, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':clubId/courts'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_court_dto_1.CreateCourtDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createCourt", null);
__decorate([
    (0, common_1.Get)(':clubId/courts'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_court_dto_1.QueryCourtDto, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findCourts", null);
__decorate([
    (0, common_1.Patch)(':clubId/courts/:courtId'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_court_dto_1.UpdateCourtDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "updateCourt", null);
__decorate([
    (0, common_1.Delete)(':clubId/courts/:courtId'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "removeCourt", null);
__decorate([
    (0, common_1.Post)(':clubId/courts/:courtId/schedules'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_court_schedule_dto_1.CreateCourtScheduleDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createCourtSchedule", null);
__decorate([
    (0, common_1.Get)(':clubId/courts/:courtId/schedules'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listCourtSchedules", null);
__decorate([
    (0, common_1.Put)(':clubId/courts/:courtId/schedules'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, replace_court_schedules_dto_1.ReplaceCourtSchedulesDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "replaceCourtSchedules", null);
__decorate([
    (0, common_1.Get)(':clubId/courts/:courtId/slots'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_court_slots_dto_1.QueryCourtSlotsDto, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listCourtSlots", null);
__decorate([
    (0, common_1.Get)(':clubId/courts/:courtId/availability-exceptions'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_court_exceptions_dto_1.QueryCourtExceptionsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listCourtAvailabilityExceptions", null);
__decorate([
    (0, common_1.Put)(':clubId/courts/:courtId/availability-exceptions'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, replace_court_exceptions_dto_1.ReplaceCourtExceptionsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "replaceCourtAvailabilityExceptions", null);
__decorate([
    (0, common_1.Get)(':clubId/courts/:courtId/custom-slots'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_court_exceptions_dto_1.QueryCourtExceptionsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listCourtCustomSlots", null);
__decorate([
    (0, common_1.Post)(':clubId/courts/:courtId/custom-slots'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, create_court_custom_slot_dto_1.CreateCourtCustomSlotDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createCourtCustomSlot", null);
__decorate([
    (0, common_1.Delete)(':clubId/courts/:courtId/custom-slots/:slotId'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('slotId', common_1.ParseUUIDPipe)),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "deleteCourtCustomSlot", null);
__decorate([
    (0, common_1.Post)(':clubId/courts/:courtId/bookings/fixed-series'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, create_fixed_series_bookings_dto_1.CreateFixedSeriesBookingsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createFixedSeriesBookings", null);
__decorate([
    (0, common_1.Post)(':clubId/courts/:courtId/bookings'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('courtId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, create_court_booking_dto_1.CreateCourtBookingDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createCourtBooking", null);
__decorate([
    (0, common_1.Patch)(':clubId/bookings/:bookingId/approve'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('bookingId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "approveCourtBooking", null);
__decorate([
    (0, common_1.Patch)(':clubId/bookings/:bookingId/reject'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('bookingId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "rejectCourtBooking", null);
__decorate([
    (0, common_1.Patch)(':clubId/bookings/:bookingId/cancel'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('bookingId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "cancelCourtBooking", null);
__decorate([
    (0, common_1.Get)(':clubId/bookings'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, query_club_bookings_dto_1.QueryClubBookingsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listClubBookings", null);
__decorate([
    (0, common_1.Get)(':clubId/dashboard'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, query_club_dashboard_dto_1.QueryClubDashboardDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "getClubDashboard", null);
__decorate([
    (0, common_1.Get)(':clubId/analytics'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, query_club_analytics_dto_1.QueryClubAnalyticsDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "getClubAnalytics", null);
__decorate([
    (0, common_1.Get)('me/bookings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listMyBookings", null);
__decorate([
    (0, common_1.Get)('bookings/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listMyBookingsAlias", null);
__decorate([
    (0, common_1.Get)('bookings/:bookingId/invite-code'),
    __param(0, (0, common_1.Param)('bookingId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "getBookingInviteCode", null);
__decorate([
    (0, common_1.Get)('invites/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "resolveInvite", null);
__decorate([
    (0, common_1.Post)('invites/:code/join'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "joinInvite", null);
__decorate([
    (0, common_1.Post)('loose-matches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_loose_match_dto_1.CreateLooseMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createLooseMatch", null);
__decorate([
    (0, common_1.Get)('me/loose-matches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_loose_match_dto_1.QueryLooseMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMyLooseMatches", null);
__decorate([
    (0, common_1.Get)('loose-matches/public'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_loose_match_dto_1.QueryLooseMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findLooseMatches", null);
__decorate([
    (0, common_1.Get)('loose-matches/:matchId/board-messages'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listLooseMatchBoardMessages", null);
__decorate([
    (0, common_1.Post)('loose-matches/:matchId/board-messages'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_board_message_dto_1.CreateBoardMessageDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "postLooseMatchBoardMessage", null);
__decorate([
    (0, common_1.Delete)('loose-matches/:matchId/board-messages/:messageId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('messageId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "deleteLooseMatchBoardMessage", null);
__decorate([
    (0, common_1.Get)('loose-matches/:matchId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findLooseMatchDetail", null);
__decorate([
    (0, common_1.Post)('loose-matches/:matchId/join'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "joinLooseMatch", null);
__decorate([
    (0, common_1.Post)('loose-matches/:matchId/leave'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "leaveLooseMatch", null);
__decorate([
    (0, common_1.Post)(':clubId/matches'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_match_dto_1.CreateMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "createMatch", null);
__decorate([
    (0, common_1.Get)('all/matches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_match_dto_1.QueryMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findPublicMatches", null);
__decorate([
    (0, common_1.Get)('matches/public'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_match_dto_1.QueryMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findPublicMatchesAlias", null);
__decorate([
    (0, common_1.Get)('me/matches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_match_dto_1.QueryMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMyMatches", null);
__decorate([
    (0, common_1.Get)('matches/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_match_dto_1.QueryMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMyMatchesAlias", null);
__decorate([
    (0, common_1.Get)('matches/:matchId/board-messages'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "listCourtBookingBoardMessages", null);
__decorate([
    (0, common_1.Post)('matches/:matchId/board-messages'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_board_message_dto_1.CreateBoardMessageDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "postCourtBookingBoardMessage", null);
__decorate([
    (0, common_1.Delete)('matches/:matchId/board-messages/:messageId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('messageId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "deleteCourtBookingBoardMessage", null);
__decorate([
    (0, common_1.Get)('matches/:matchId'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMatchDetail", null);
__decorate([
    (0, common_1.Get)(':clubId/matches'),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_match_dto_1.QueryMatchDto]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "findMatches", null);
__decorate([
    (0, common_1.Post)('matches/:matchId/join'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "joinMatch", null);
__decorate([
    (0, common_1.Post)('matches/:matchId/leave'),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClubController.prototype, "leaveMatch", null);
exports.ClubController = ClubController = __decorate([
    (0, common_1.Controller)('clubs'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [club_service_1.ClubService])
], ClubController);
//# sourceMappingURL=club.controller.js.map