import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import type { PrismaService } from '../../prisma/prisma.service';

jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      profile: {
        upsert: jest.fn(),
      },
    } as any;

    service = new ProfileService(prisma);
  });

  it('should get or create profile, or throw', async () => {
    const error = new Error('err');
    prisma.profile.upsert.mockRejectedValueOnce(error as any);

    await expect(service.getProfile('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    const profile = { id: '1' };
    prisma.profile.upsert.mockResolvedValue(profile as any);

    await expect(service.getProfile('1')).resolves.toBe(profile);
  });

  it('should update profile or throw', async () => {
    const updated = { id: '1' };
    prisma.profile.upsert.mockResolvedValueOnce(updated as any);

    await expect(
      service.updateProfile('1', { isClub: true } as any),
    ).resolves.toBe(updated);

    prisma.profile.upsert.mockRejectedValueOnce(new Error('err') as any);

    await expect(
      service.updateProfile('1', { isClub: true } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should reject update with empty dto', async () => {
    await expect(service.updateProfile('1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.profile.upsert).not.toHaveBeenCalled();
  });
});
