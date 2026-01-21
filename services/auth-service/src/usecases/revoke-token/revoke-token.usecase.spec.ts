import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RevokeTokenUseCase } from './revoke-token.usecase';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { RevokeTokenDto } from './revoke-token.dto';
import { AuthToken } from '../../entities/auth-token.entity';

describe('RevokeTokenUseCase', () => {
  let usecase: RevokeTokenUseCase;
  let authTokenRepo: jest.Mocked<IAuthTokenRepository>;

  const mockAuthTokenRepo = {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByToken: jest.fn(),
    updateExpiredAt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RevokeTokenUseCase,
        {
          provide: IAuthTokenRepository,
          useValue: mockAuthTokenRepo,
        },
      ],
    }).compile();

    usecase = module.get<RevokeTokenUseCase>(RevokeTokenUseCase);
    authTokenRepo = module.get(IAuthTokenRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const revokeTokenDto: RevokeTokenDto = {
      token: 'valid-token-123',
    };

    const mockAuthToken = {
      id: 'uuid-token-1',
      authId: 'uuid-auth-1',
      token: 'valid-token-123',
      expiredAt: new Date(),
      createdAt: new Date(),
    } as AuthToken;

    it('devrait révoquer un token valide correctement', async () => {
      authTokenRepo.findByToken.mockResolvedValue(mockAuthToken);
      authTokenRepo.deleteByToken.mockResolvedValue(undefined);

      const result = await usecase.execute(revokeTokenDto);

      expect(authTokenRepo.findByToken).toHaveBeenCalledWith(
        revokeTokenDto.token,
      );
      expect(authTokenRepo.deleteByToken).toHaveBeenCalledWith(
        revokeTokenDto.token,
      );
      expect(result).toEqual({ message: 'Token revoked successfully' });
    });

    it('devrait lever une erreur si le token existe pas', async () => {
      authTokenRepo.findByToken.mockResolvedValue(null);

      await expect(usecase.execute(revokeTokenDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usecase.execute(revokeTokenDto)).rejects.toThrow(
        'Token not found',
      );
      expect(authTokenRepo.findByToken).toHaveBeenCalledWith(
        revokeTokenDto.token,
      );
      expect(authTokenRepo.deleteByToken).not.toHaveBeenCalled();
    });

    it('devrait supprimer le token de la base de données', async () => {
      authTokenRepo.findByToken.mockResolvedValue(mockAuthToken);
      authTokenRepo.deleteByToken.mockResolvedValue(undefined);

      await usecase.execute(revokeTokenDto);

      expect(authTokenRepo.deleteByToken).toHaveBeenCalledTimes(1);
      expect(authTokenRepo.deleteByToken).toHaveBeenCalledWith(
        revokeTokenDto.token,
      );
    });
  });
});
