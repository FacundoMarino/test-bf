import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { QueryClubDto } from './dto/query-club.dto';
import { QueryCourtDto } from './dto/query-court.dto';

jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

describe('ClubController', () => {
  let controller: ClubController;
  let service: jest.Mocked<ClubService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findMine: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      createCourt: jest.fn(),
      findCourts: jest.fn(),
      updateCourt: jest.fn(),
      removeCourt: jest.fn(),
    } as unknown as jest.Mocked<ClubService>;

    controller = new ClubController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to service', async () => {
    const user = { id: 'user-id' };
    const dto: any = { name: 'Club' };
    const created = { id: '1' };
    service.create.mockResolvedValue(created as any);

    const result = await controller.create(user, dto);

    expect(service.create).toHaveBeenCalledWith(dto, user.id);
    expect(result).toBe(created);
  });

  it('should delegate findAll to service', async () => {
    const query = { page: 1 } as QueryClubDto;
    const response = { data: [] };
    service.findAll.mockResolvedValue(response as any);

    const result = await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toBe(response);
  });

  it('should delegate findOne to service', async () => {
    const club = { id: '1' };
    service.findOne.mockResolvedValue(club as any);

    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toBe(club);
  });

  it('should delegate update to service', async () => {
    const dto: any = { name: 'updated' };
    const updated = { id: '1', ...dto };
    service.update.mockResolvedValue(updated);
    const user = { id: 'user-id' } as any;

    const result = await controller.update('1', dto, user);

    expect(service.update).toHaveBeenCalledWith('1', dto, 'user-id');
    expect(result).toBe(updated);
  });

  it('should delegate remove to service', async () => {
    const response = { message: 'ok' };
    service.remove.mockResolvedValue(response as any);
    const user = { id: 'user-id' } as any;

    const result = await controller.remove('1', user);

    expect(service.remove).toHaveBeenCalledWith('1', 'user-id');
    expect(result).toBe(response);
  });

  it('should delegate createCourt to service', async () => {
    const dto: any = { name: 'Court' };
    const created = { id: 'c1' };
    service.createCourt.mockResolvedValue(created as any);

    const result = await controller.createCourt('club-id', dto);

    expect(service.createCourt).toHaveBeenCalledWith('club-id', dto);
    expect(result).toBe(created);
  });

  it('should delegate findCourts to service', async () => {
    const query = { page: 1 } as QueryCourtDto;
    const response = { data: [] };
    service.findCourts.mockResolvedValue(response as any);
    const user = { id: 'user-id' } as any;

    const result = await controller.findCourts('club-id', query, user);

    expect(service.findCourts).toHaveBeenCalledWith(
      'club-id',
      query,
      'user-id',
    );
    expect(result).toBe(response);
  });

  it('should delegate updateCourt to service', async () => {
    const dto: any = { name: 'Court' };
    const updated = { id: 'c1' };
    service.updateCourt.mockResolvedValue(updated as any);

    const result = await controller.updateCourt('club-id', 'court-id', dto);

    expect(service.updateCourt).toHaveBeenCalledWith(
      'club-id',
      'court-id',
      dto,
    );
    expect(result).toBe(updated);
  });

  it('should delegate removeCourt to service', async () => {
    const response = { message: 'ok' };
    service.removeCourt.mockResolvedValue(response as any);

    const result = await controller.removeCourt('club-id', 'court-id');

    expect(service.removeCourt).toHaveBeenCalledWith('club-id', 'court-id');
    expect(result).toBe(response);
  });
});
