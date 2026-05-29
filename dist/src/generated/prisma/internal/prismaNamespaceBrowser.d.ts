import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Profile: "Profile";
    readonly Club: "Club";
    readonly Court: "Court";
    readonly CourtCustomSlot: "CourtCustomSlot";
    readonly CourtScheduleException: "CourtScheduleException";
    readonly CourtSchedule: "CourtSchedule";
    readonly CourtBooking: "CourtBooking";
    readonly CourtBookingParticipant: "CourtBookingParticipant";
    readonly LooseMatch: "LooseMatch";
    readonly CourtBookingBoardMessage: "CourtBookingBoardMessage";
    readonly LooseMatchBoardMessage: "LooseMatchBoardMessage";
    readonly LooseMatchParticipant: "LooseMatchParticipant";
    readonly EmailSendLog: "EmailSendLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const ProfileScalarFieldEnum: {
    readonly id: "id";
    readonly fullName: "fullName";
    readonly avatarUrl: "avatarUrl";
    readonly description: "description";
    readonly location: "location";
    readonly phone: "phone";
    readonly email: "email";
    readonly amenities: "amenities";
    readonly level: "level";
    readonly preferredPosition: "preferredPosition";
    readonly courtType: "courtType";
    readonly availability: "availability";
    readonly isClub: "isClub";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];
export declare const ClubScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly courtCount: "courtCount";
    readonly courtType: "courtType";
    readonly address: "address";
    readonly location: "location";
    readonly email: "email";
    readonly web: "web";
    readonly avatarUrl: "avatarUrl";
    readonly pricing: "pricing";
    readonly approvalStatus: "approvalStatus";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ClubScalarFieldEnum = (typeof ClubScalarFieldEnum)[keyof typeof ClubScalarFieldEnum];
export declare const CourtScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly type: "type";
    readonly surface: "surface";
    readonly lighting: "lighting";
    readonly listed: "listed";
    readonly clubId: "clubId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScalarFieldEnum = (typeof CourtScalarFieldEnum)[keyof typeof CourtScalarFieldEnum];
export declare const CourtCustomSlotScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly date: "date";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly price: "price";
    readonly note: "note";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtCustomSlotScalarFieldEnum = (typeof CourtCustomSlotScalarFieldEnum)[keyof typeof CourtCustomSlotScalarFieldEnum];
export declare const CourtScheduleExceptionScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly date: "date";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly isClosedAllDay: "isClosedAllDay";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScheduleExceptionScalarFieldEnum = (typeof CourtScheduleExceptionScalarFieldEnum)[keyof typeof CourtScheduleExceptionScalarFieldEnum];
export declare const CourtScheduleScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly dayOfWeek: "dayOfWeek";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly slotDurationMinutes: "slotDurationMinutes";
    readonly pricePerHour: "pricePerHour";
    readonly periodName: "periodName";
    readonly periodStart: "periodStart";
    readonly periodEnd: "periodEnd";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScheduleScalarFieldEnum = (typeof CourtScheduleScalarFieldEnum)[keyof typeof CourtScheduleScalarFieldEnum];
export declare const CourtBookingScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly userId: "userId";
    readonly start: "start";
    readonly end: "end";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly isMatch: "isMatch";
    readonly title: "title";
    readonly maxPlayers: "maxPlayers";
    readonly level: "level";
    readonly visibility: "visibility";
    readonly inviteCode: "inviteCode";
    readonly manualGuests: "manualGuests";
    readonly manualClubNotes: "manualClubNotes";
    readonly occupiesSlot: "occupiesSlot";
    readonly isFixedSeries: "isFixedSeries";
    readonly fixedSeriesId: "fixedSeriesId";
    readonly fixedSeriesOccurrenceIndex: "fixedSeriesOccurrenceIndex";
    readonly fixedSeriesRule: "fixedSeriesRule";
};
export type CourtBookingScalarFieldEnum = (typeof CourtBookingScalarFieldEnum)[keyof typeof CourtBookingScalarFieldEnum];
export declare const CourtBookingParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly profileId: "profileId";
    readonly createdAt: "createdAt";
};
export type CourtBookingParticipantScalarFieldEnum = (typeof CourtBookingParticipantScalarFieldEnum)[keyof typeof CourtBookingParticipantScalarFieldEnum];
export declare const LooseMatchScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly title: "title";
    readonly startLabel: "startLabel";
    readonly level: "level";
    readonly courtType: "courtType";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly inviteCode: "inviteCode";
};
export type LooseMatchScalarFieldEnum = (typeof LooseMatchScalarFieldEnum)[keyof typeof LooseMatchScalarFieldEnum];
export declare const CourtBookingBoardMessageScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly authorProfileId: "authorProfileId";
    readonly body: "body";
    readonly createdAt: "createdAt";
};
export type CourtBookingBoardMessageScalarFieldEnum = (typeof CourtBookingBoardMessageScalarFieldEnum)[keyof typeof CourtBookingBoardMessageScalarFieldEnum];
export declare const LooseMatchBoardMessageScalarFieldEnum: {
    readonly id: "id";
    readonly looseMatchId: "looseMatchId";
    readonly authorProfileId: "authorProfileId";
    readonly body: "body";
    readonly createdAt: "createdAt";
};
export type LooseMatchBoardMessageScalarFieldEnum = (typeof LooseMatchBoardMessageScalarFieldEnum)[keyof typeof LooseMatchBoardMessageScalarFieldEnum];
export declare const LooseMatchParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly looseMatchId: "looseMatchId";
    readonly profileId: "profileId";
    readonly createdAt: "createdAt";
};
export type LooseMatchParticipantScalarFieldEnum = (typeof LooseMatchParticipantScalarFieldEnum)[keyof typeof LooseMatchParticipantScalarFieldEnum];
export declare const EmailSendLogScalarFieldEnum: {
    readonly id: "id";
    readonly status: "status";
    readonly eventType: "eventType";
    readonly fromEmail: "fromEmail";
    readonly toEmail: "toEmail";
    readonly subject: "subject";
    readonly bodyText: "bodyText";
    readonly bodyHtml: "bodyHtml";
    readonly errorDetail: "errorDetail";
    readonly sentAt: "sentAt";
};
export type EmailSendLogScalarFieldEnum = (typeof EmailSendLogScalarFieldEnum)[keyof typeof EmailSendLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
