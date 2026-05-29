import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  private prismaErrorCode(e: unknown): string | null {
    if (
      e !== null &&
      typeof e === 'object' &&
      'code' in e &&
      typeof (e as { code: unknown }).code === 'string'
    ) {
      return (e as { code: string }).code;
    }
    return null;
  }

  private normalizePhone(value: string | undefined | null): string | null {
    if (value === undefined || value === null) return null;
    const t = value.trim();
    return t.length > 0 ? t : null;
  }

  /** Solo incluye campos presentes en el DTO; Prisma rechaza `update: {}` en upsert. */
  private buildProfileUpdate(dto: UpdateProfileDto): Prisma.ProfileUpdateInput {
    const u: Prisma.ProfileUpdateInput = {};
    if (dto.fullName !== undefined) u.fullName = dto.fullName;
    if (dto.description !== undefined) u.description = dto.description;
    if (dto.location !== undefined) u.location = dto.location;
    if (dto.level !== undefined) u.level = dto.level;
    if (dto.preferredPosition !== undefined)
      u.preferredPosition = dto.preferredPosition;
    if (dto.courtType !== undefined) u.courtType = dto.courtType;
    if (dto.avatarUrl !== undefined) u.avatarUrl = dto.avatarUrl;
    if (dto.availability !== undefined) {
      u.availability = dto.availability as unknown as Prisma.InputJsonValue;
    }
    if (dto.isClub !== undefined) u.isClub = dto.isClub;
    if (dto.phone !== undefined) u.phone = this.normalizePhone(dto.phone);
    if (dto.email !== undefined) u.email = dto.email;
    if (dto.amenities !== undefined) {
      u.amenities = dto.amenities as unknown as Prisma.InputJsonValue;
    }
    return u;
  }

  async getProfile(userId: string) {
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

      if (!profile) throw new NotFoundException('Profile not found');
      return profile;
    } catch (e) {
      const code = this.prismaErrorCode(e);
      if (code === 'P2022') {
        const msg = e instanceof Error ? e.message : String(e);
        this.logger.error(
          `getProfile schema drift (P2022) userId=${userId}: ${msg}`,
        );
        throw new InternalServerErrorException(
          'La base de datos no coincide con el esquema de perfiles. En auth-service ejecutá: npx prisma migrate deploy',
        );
      }
      this.logger.warn(
        `getProfile failed for ${userId}: ${e instanceof Error ? e.message : e}`,
      );
      throw new NotFoundException('Profile not found');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!userId?.trim()) {
      throw new BadRequestException('Usuario inválido');
    }

    const update = this.buildProfileUpdate(dto);
    if (Object.keys(update).length === 0) {
      this.logger.warn(
        `updateProfile: empty payload after mapping, userId=${userId}`,
      );
      throw new BadRequestException('No hay datos de perfil para actualizar');
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
            []) as unknown as Prisma.InputJsonValue,
          isClub: dto.isClub ?? false,
          phone: this.normalizePhone(dto.phone),
          email: dto.email ?? null,
          amenities: (dto.amenities ?? {}) as unknown as Prisma.InputJsonValue,
        },
        update,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.error(`updateProfile failed userId=${userId}: ${msg}`, e);
      const prismaCode = this.prismaErrorCode(e);
      if (prismaCode === 'P2003') {
        throw new BadRequestException(
          'No existe perfil vinculado a tu cuenta. Cerrá sesión y volvé a entrar.',
        );
      }
      if (prismaCode === 'P2022') {
        throw new InternalServerErrorException(
          'La base de datos no coincide con el esquema de perfiles. En auth-service ejecutá: npx prisma migrate deploy (o agregá la columna email en la tabla profiles).',
        );
      }
      throw new BadRequestException(
        'No se pudo guardar el perfil. Si el problema continúa, contactá soporte.',
      );
    }
  }
}
