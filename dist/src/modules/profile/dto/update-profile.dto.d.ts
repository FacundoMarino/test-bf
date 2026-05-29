export declare class AvailabilitySlotDto {
    day: string;
    timeSlots?: string[];
    startTime?: string;
    endTime?: string;
    slotDurationMinutes?: number;
}
export declare class UpdateProfileDto {
    fullName?: string;
    description?: string;
    location?: string;
    phone?: string;
    email?: string | null;
    amenities?: Record<string, boolean>;
    level?: number;
    preferredPosition?: string;
    courtType?: string;
    avatarUrl?: string;
    availability?: AvailabilitySlotDto[];
    isClub?: boolean;
}
