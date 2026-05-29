export declare const ClubApprovalStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type ClubApprovalStatus = (typeof ClubApprovalStatus)[keyof typeof ClubApprovalStatus];
export declare const CourtBookingStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly REJECTED: "REJECTED";
    readonly CANCELLED: "CANCELLED";
};
export type CourtBookingStatus = (typeof CourtBookingStatus)[keyof typeof CourtBookingStatus];
export declare const EmailSendStatus: {
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
    readonly SKIPPED: "SKIPPED";
};
export type EmailSendStatus = (typeof EmailSendStatus)[keyof typeof EmailSendStatus];
