import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ListMatchsUsecase } from './list-matchs-usecase.service';
import { IMatchRepository } from '../../repositories/match.repository';
import { MatchStatus } from '../../entities/match.entity';

describe('ListMatchsUsecase', () => {
  let usecase: ListMatchsUsecase;
  let matchRepo: jest.Mocked<IMatchRepository>;

  const mockMatchRepo = {
    list: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListMatchsUsecase,
        {
          provide: IMatchRepository,
          useValue: mockMatchRepo,
        },
      ],
    }).compile();

    usecase = module.get<ListMatchsUsecase>(ListMatchsUsecase);
    matchRepo = module.get(IMatchRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('devrait retourner la liste des matchs correctement', async () => {
      const mockMatches = [
        {
          id: 'uuid-match-1',
          equipeA: 'Team A',
          equipeB: 'Team B',
          date: new Date('2024-01-15'),
          location: 'Stade A',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
        {
          id: 'uuid-match-2',
          equipeA: 'Team C',
          equipeB: 'Team D',
          date: new Date('2024-01-16'),
          location: 'Stade B',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
      ];

      matchRepo.list.mockResolvedValue(mockMatches);

      const result = await usecase.execute();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchRepo.list).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchRepo.list).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMatches);
      expect(result).toHaveLength(2);
    });

    it('devrait bloquer si aucun match trouvé', async () => {
      matchRepo.list.mockResolvedValue([]);

      await expect(usecase.execute()).rejects.toThrow(UnauthorizedException);
      await expect(usecase.execute()).rejects.toThrow('Match not found');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchRepo.list).toHaveBeenCalled();
    });

    it('devrait bloquer si matches est null', async () => {
      matchRepo.list.mockResolvedValue(null as any);

      await expect(usecase.execute()).rejects.toThrow(UnauthorizedException);
      await expect(usecase.execute()).rejects.toThrow('Match not found');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchRepo.list).toHaveBeenCalled();
    });

    it('devrait bloquer si matches est undefined', async () => {
      matchRepo.list.mockResolvedValue(undefined as any);

      await expect(usecase.execute()).rejects.toThrow(UnauthorizedException);
      await expect(usecase.execute()).rejects.toThrow('Match not found');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchRepo.list).toHaveBeenCalled();
    });

    it("devrait retourner un seul match s'il y en a qu'un", async () => {
      const singleMatch = [
        {
          id: 'uuid-single-match',
          equipeA: 'Team A',
          equipeB: 'Team B',
          date: new Date('2024-01-15'),
          location: 'Stade A',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
      ];

      matchRepo.list.mockResolvedValue(singleMatch);

      const result = await usecase.execute();

      expect(result).toEqual(singleMatch);
      expect(result).toHaveLength(1);
    });

    it('devrait retourner tous les matchs du repository', async () => {
      const mockMatches = [
        {
          id: 'uuid-match-a',
          equipeA: 'A',
          equipeB: 'B',
          date: new Date(),
          location: 'Stade',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
        {
          id: 'uuid-match-b',
          equipeA: 'C',
          equipeB: 'D',
          date: new Date(),
          location: 'Stade',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
        {
          id: 'uuid-match-c',
          equipeA: 'E',
          equipeB: 'F',
          date: new Date(),
          location: 'Stade',
          scoreA: null,
          scoreB: null,
          status: MatchStatus.SCHEDULED,
        },
      ];

      matchRepo.list.mockResolvedValue(mockMatches);

      const result = await usecase.execute();

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockMatches);
    });
  });
});
