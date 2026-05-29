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
var ProfileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProfileService = ProfileService_1 = class ProfileService {
    prisma;
    logger = new common_1.Logger(ProfileService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    prismaErrorCode(e) {
        if (e !== null &&
            typeof e === 'object' &&
            'code' in e &&
            typeof e.code === 'string') {
            return e.code;
        }
        return null;
    }
    normalizePhone(value) {
        if (value === undefined || value === null)
            return null;
        const t = value.trim();
        return t.length > 0 ? t : null;
    }
    buildProfileUpdate(dto) {
        const u = {};
        if (dto.fullName !== undefined)
            u.fullName = dto.fullName;
        if (dto.description !== undefined)
            u.description = dto.description;
        if (dto.location !== undefined)
            u.location = dto.location;
        if (dto.level !== undefined)
            u.level = dto.level;
        if (dto.preferredPosition !== undefined)
            u.preferredPosition = dto.preferredPosition;
        if (dto.courtType !== undefined)
            u.courtType = dto.courtType;
        if (dto.avatarUrl !== undefined)
            u.avatarUrl = dto.avatarUrl;
        if (dto.availability !== undefined) {
            u.availability = dto.availability;
        }
        if (dto.isClub !== undefined)
            u.isClub = dto.isClub;
        if (dto.phone !== undefined)
            u.phone = this.normalizePhone(dto.phone);
        if (dto.email !== undefined)
            u.email = dto.email;
        if (dto.amenities !== undefined) {
            u.amenities = dto.amenities;
        }
        return u;
    }
    async getProfile(userId) {
        try {
            const profile = await this.prisma.profile.upsert({
                where: { id: userId },
                update: {},
                create: {
                    id: userId,
                    description: '',
                    location: '',
                    isClub: false,
                    phone: null,
                    email: null,
                    availability: [],
                    amenities: {},
                },
            });
            if (!profile)
                throw new common_1.NotFoundException('Profile not found');
            return profile;
        }
        catch (e) {
            const code = this.prismaErrorCode(e);
            if (code === 'P2022') {
                const msg = e instanceof Error ? e.message : String(e);
                this.logger.error(`getProfile schema drift (P2022) userId=${userId}: ${msg}`);
                throw new common_1.InternalServerErrorException('La base de datos no coincide con el esquema de perfiles. En auth-service ejecutá: npx prisma migrate deploy');
            }
            this.logger.warn(`getProfile failed for ${userId}: ${e instanceof Error ? e.message : e}`);
            throw new common_1.NotFoundException('Profile not found');
        }
    }
    async updateProfile(userId, dto) {
        if (!userId?.trim()) {
            throw new common_1.BadRequestException('Usuario inválido');
        }
        const update = this.buildProfileUpdate(dto);
        if (Object.keys(update).length === 0) {
            this.logger.warn(`updateProfile: empty payload after mapping, userId=${userId}`);
            throw new common_1.BadRequestException('No hay datos de perfil para actualizar');
        }
        try {
            return await this.prisma.profile.upsert({
                where: { id: userId },
                create: {
                    id: userId,
                    fullName: dto.fullName ?? null,
                    description: dto.description ?? '',
                    location: dto.location ?? '',
                    level: dto.level ?? null,
                    preferredPosition: dto.preferredPosition ?? null,
                    courtType: dto.courtType ?? null,
                    avatarUrl: dto.avatarUrl ?? null,
                    availability: (dto.availability ??
                        []),
                    isClub: dto.isClub ?? false,
                    phone: this.normalizePhone(dto.phone),
                    email: dto.email ?? null,
                    amenities: (dto.amenities ?? {}),
                },
                update,
            });
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            this.logger.error(`updateProfile failed userId=${userId}: ${msg}`, e);
            const prismaCode = this.prismaErrorCode(e);
            if (prismaCode === 'P2003') {
                throw new common_1.BadRequestException('No existe perfil vinculado a tu cuenta. Cerrá sesión y volvé a entrar.');
            }
            if (prismaCode === 'P2022') {
                throw new common_1.InternalServerErrorException('La base de datos no coincide con el esquema de perfiles. En auth-service ejecutá: npx prisma migrate deploy (o agregá la columna email en la tabla profiles).');
            }
            throw new common_1.BadRequestException('No se pudo guardar el perfil. Si el problema continúa, contactá soporte.');
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = ProfileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map