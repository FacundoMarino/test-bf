import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private prismaErrorCode;
    private normalizePhone;
    private buildProfileUpdate;
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
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
