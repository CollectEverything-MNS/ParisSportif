import { Test, TestingModule } from '@nestjs/testing';
import { SoftDeleteUseCase } from './soft-delete.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { SoftDeleteDto } from './soft-delete.dto';

describe('SoftDeleteUseCase', () => {
  let usecase: SoftDeleteUseCase;
  let authRepo: jest.Mocked<IAuthRepository>;

  const mockAuthRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    softDeleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftDeleteUseCase,
        {
          provide: IAuthRepository,
          useValue: mockAuthRepo,
        },
      ],
    }).compile();

    usecase = module.get<SoftDeleteUseCase>(SoftDeleteUseCase);
    authRepo = module.get(IAuthRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const softDeleteDto: SoftDeleteDto = {
      authId: 'id1',
    };

    it('devrait supprimer un utilisateur en soft delete', async () => {
      authRepo.softDeleteById.mockResolvedValue(undefined);

      const result = await usecase.execute(softDeleteDto);

      expect(authRepo.softDeleteById).toHaveBeenCalledWith(softDeleteDto.authId);
      expect(authRepo.softDeleteById).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('devrait appeler le repository avec le bon authId', async () => {
      authRepo.softDeleteById.mockResolvedValue(undefined);

      await usecase.execute(softDeleteDto);

      expect(authRepo.softDeleteById).toHaveBeenCalledWith(1);
    });

    it('devrait gérer différentes valeurs de authId', async () => {
      const differentDto: SoftDeleteDto = { authId: 'id999' };
      authRepo.softDeleteById.mockResolvedValue(undefined);

      await usecase.execute(differentDto);

      expect(authRepo.softDeleteById).toHaveBeenCalledWith(999);
    });
  });
});
