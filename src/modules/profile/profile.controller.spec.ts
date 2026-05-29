import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  beforeEach(() => {
    service = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileService>;

    controller = new ProfileController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate getProfile to service', async () => {
    const user = { id: 'u' };
    const profile = { id: 'u', name: 'User' };
    service.getProfile.mockResolvedValue(profile as any);

    const result = await controller.getProfile(user);

    expect(service.getProfile).toHaveBeenCalledWith(user.id);
    expect(result).toBe(profile);
  });

  it('should delegate updateProfile to service', async () => {
    const user = { id: 'u' };
    const dto: any = { fullName: 'New' };
    const updated = { id: 'u', fullName: 'New' };
    service.updateProfile.mockResolvedValue(updated as any);

    const result = await controller.updateProfile(user, dto);

    expect(service.updateProfile).toHaveBeenCalledWith(user.id, dto);
    expect(result).toBe(updated);
  });
});
