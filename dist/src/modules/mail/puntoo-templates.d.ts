export type MatchGenderUi = 'male' | 'female' | 'mixed' | null;
export type ParticipantSlot = {
    label: string;
    name: string | null;
    struck?: boolean;
};
export declare function formatEsDate(d: Date): string;
export declare function formatEsTime(d: Date): string;
export declare function formatMoneyEur(amount: number): string;
export declare function matchGenderLabel(g: MatchGenderUi): string;
export declare function bookingStatusLabel(status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED', occupiesSlot: boolean): string;
export declare function closedBookingConfirmationEmail(input: {
    recipientName: string;
    start: Date;
    end: Date;
    totalPrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function openMatchPublishedEmail(input: {
    organizerName: string;
    statusLabel: string;
    level: number | null;
    modality: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function playerJoinedOrganizerEmail(input: {
    statusLabel: string;
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
    playerSlots: ParticipantSlot[];
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function playerJoinedSelfEmail(input: {
    statusLabel: string;
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
    playerSlots: ParticipantSlot[];
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function matchConfirmedAllEmail(input: {
    statusLabel: string;
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
    playerSlots: ParticipantSlot[];
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function leaveSelfEmail(input: {
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function leaveOrganizerEmail(input: {
    statusLabel: string;
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
    playerSlots: ParticipantSlot[];
}): {
    subject: string;
    text: string;
    html: string;
};
export declare function droppedFromFullEmail(input: {
    statusLabel: string;
    level: number | null;
    modality: string;
    organizerName: string;
    start: Date;
    sharePrice: number;
    club: {
        name: string;
        address: string;
        email?: string | null;
    };
    playerSlots: ParticipantSlot[];
}): {
    subject: string;
    text: string;
    html: string;
};
