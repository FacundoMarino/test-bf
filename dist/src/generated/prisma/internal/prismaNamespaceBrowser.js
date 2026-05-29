"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.EmailSendLogScalarFieldEnum = exports.LooseMatchParticipantScalarFieldEnum = exports.LooseMatchBoardMessageScalarFieldEnum = exports.CourtBookingBoardMessageScalarFieldEnum = exports.LooseMatchScalarFieldEnum = exports.CourtBookingParticipantScalarFieldEnum = exports.CourtBookingScalarFieldEnum = exports.CourtScheduleScalarFieldEnum = exports.CourtScheduleExceptionScalarFieldEnum = exports.CourtCustomSlotScalarFieldEnum = exports.CourtScalarFieldEnum = exports.ClubScalarFieldEnum = exports.ProfileScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Profile: 'Profile',
    Club: 'Club',
    Court: 'Court',
    CourtCustomSlot: 'CourtCustomSlot',
    CourtScheduleException: 'CourtScheduleException',
    CourtSchedule: 'CourtSchedule',
    CourtBooking: 'CourtBooking',
    CourtBookingParticipant: 'CourtBookingParticipant',
    LooseMatch: 'LooseMatch',
    CourtBookingBoardMessage: 'CourtBookingBoardMessage',
    LooseMatchBoardMessage: 'LooseMatchBoardMessage',
    LooseMatchParticipant: 'LooseMatchParticipant',
    EmailSendLog: 'EmailSendLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.ProfileScalarFieldEnum = {
    id: 'id',
    fullName: 'fullName',
    avatarUrl: 'avatarUrl',
    description: 'description',
    location: 'location',
    phone: 'phone',
    email: 'email',
    amenities: 'amenities',
    level: 'level',
    preferredPosition: 'preferredPosition',
    courtType: 'courtType',
    availability: 'availability',
    isClub: 'isClub',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ClubScalarFieldEnum = {
    id: 'id',
    name: 'name',
    courtCount: 'courtCount',
    courtType: 'courtType',
    address: 'address',
    location: 'location',
    email: 'email',
    web: 'web',
    avatarUrl: 'avatarUrl',
    pricing: 'pricing',
    approvalStatus: 'approvalStatus',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourtScalarFieldEnum = {
    id: 'id',
    name: 'name',
    type: 'type',
    surface: 'surface',
    lighting: 'lighting',
    listed: 'listed',
    clubId: 'clubId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourtCustomSlotScalarFieldEnum = {
    id: 'id',
    courtId: 'courtId',
    date: 'date',
    startTimeMinutes: 'startTimeMinutes',
    endTimeMinutes: 'endTimeMinutes',
    price: 'price',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourtScheduleExceptionScalarFieldEnum = {
    id: 'id',
    courtId: 'courtId',
    date: 'date',
    startTimeMinutes: 'startTimeMinutes',
    endTimeMinutes: 'endTimeMinutes',
    isClosedAllDay: 'isClosedAllDay',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourtScheduleScalarFieldEnum = {
    id: 'id',
    courtId: 'courtId',
    dayOfWeek: 'dayOfWeek',
    startTimeMinutes: 'startTimeMinutes',
    endTimeMinutes: 'endTimeMinutes',
    slotDurationMinutes: 'slotDurationMinutes',
    pricePerHour: 'pricePerHour',
    periodName: 'periodName',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CourtBookingScalarFieldEnum = {
    id: 'id',
    courtId: 'courtId',
    userId: 'userId',
    start: 'start',
    end: 'end',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isMatch: 'isMatch',
    title: 'title',
    maxPlayers: 'maxPlayers',
    level: 'level',
    visibility: 'visibility',
    inviteCode: 'inviteCode',
    manualGuests: 'manualGuests',
    manualClubNotes: 'manualClubNotes',
    occupiesSlot: 'occupiesSlot',
    isFixedSeries: 'isFixedSeries',
    fixedSeriesId: 'fixedSeriesId',
    fixedSeriesOccurrenceIndex: 'fixedSeriesOccurrenceIndex',
    fixedSeriesRule: 'fixedSeriesRule'
};
exports.CourtBookingParticipantScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    profileId: 'profileId',
    createdAt: 'createdAt'
};
exports.LooseMatchScalarFieldEnum = {
    id: 'id',
    profileId: 'profileId',
    title: 'title',
    startLabel: 'startLabel',
    level: 'level',
    courtType: 'courtType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    inviteCode: 'inviteCode'
};
exports.CourtBookingBoardMessageScalarFieldEnum = {
    id: 'id',
    bookingId: 'bookingId',
    authorProfileId: 'authorProfileId',
    body: 'body',
    createdAt: 'createdAt'
};
exports.LooseMatchBoardMessageScalarFieldEnum = {
    id: 'id',
    looseMatchId: 'looseMatchId',
    authorProfileId: 'authorProfileId',
    body: 'body',
    createdAt: 'createdAt'
};
exports.LooseMatchParticipantScalarFieldEnum = {
    id: 'id',
    looseMatchId: 'looseMatchId',
    profileId: 'profileId',
    createdAt: 'createdAt'
};
exports.EmailSendLogScalarFieldEnum = {
    id: 'id',
    status: 'status',
    eventType: 'eventType',
    fromEmail: 'fromEmail',
    toEmail: 'toEmail',
    subject: 'subject',
    bodyText: 'bodyText',
    bodyHtml: 'bodyHtml',
    errorDetail: 'errorDetail',
    sentAt: 'sentAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map