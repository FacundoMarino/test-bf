import type { User } from '@supabase/supabase-js';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(user: User): Promise<{
        email: string | null;
        fullName: string | null;
        isClub: boolean;
        id: string;
        avatarUrl: string | null;
        description: string | null;
        location: string | null;
        phone: string | null;
        amenities: import("@prisma/client/runtime/client").JsonValue;
        level: number | null;
        preferredPosition: string | null;
        courtType: string | null;
        availability: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(user: User, dto: UpdateProfileDto): Promise<{
        email: string | null;
        fullName: string | null;
        isClub: boolean;
        id: string;
        avatarUrl: string | null;
        description: string | null;
        location: string | null;
        phone: string | null;
        amenities: import("@prisma/client/runtime/client").JsonValue;
        level: number | null;
        preferredPosition: string | null;
        courtType: string | null;
        availability: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
