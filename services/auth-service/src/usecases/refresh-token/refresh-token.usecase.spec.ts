import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RefreshTokenUseCase } from './refresh-token.usecase';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { RefreshTokenDto } from './refresh-token.dto';
import { AuthToken } from '../../entities/auth-token.entity';

describe('RefreshTokenUseCase', () => {
  let usecase: RefreshTokenUseCase;
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
        RefreshTokenUseCase,
        {
          provide: IAuthTokenRepository,
          useValue: mockAuthTokenRepo,
        },
      ],
    }).compile();

    usecase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    authTokenRepo = module.get(IAuthTokenRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const refreshTokenDto: RefreshTokenDto = {
      token: 'valid-token-123',
    };

    it('devrait renouveler un token valide sans problème', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 12);

      const mockAuthToken = {
        id: 'uuid-token-1',
        authId: 'uuid-auth-1',
        token: 'valid-token-123',
        expiredAt: futureDate,
        createdAt: new Date(),
      } as AuthToken;

      const updatedToken = {
        ...mockAuthToken,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      } as AuthToken;

      authTokenRepo.findByToken.mockResolvedValue(mockAuthToken);
      authTokenRepo.updateExpiredAt.mockResolvedValue(updatedToken);

      const result = await usecase.execute(refreshTokenDto);

      expect(authTokenRepo.findByToken).toHaveBeenCalledWith(
        refreshTokenDto.token,
      );
      expect(authTokenRepo.updateExpiredAt).toHaveBeenCalledWith(
        refreshTokenDto.token,
        expect.any(Date),
      );
      expect(result).toEqual({
        token: updatedToken.token,
        expiredAt: updatedToken.expiredAt,
      });
    });

    it('devrait rejeter si le token existe pas', async () => {
      authTokenRepo.findByToken.mockResolvedValue(null);

      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        'Token not found',
      );
      expect(authTokenRepo.findByToken).toHaveBeenCalledWith(
        refreshTokenDto.token,
      );
      expect(authTokenRepo.updateExpiredAt).not.toHaveBeenCalled();
    });

    it('devrait bloquer si le token est expiré', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const expiredToken = {
        id: 'uuid-token-expired',
        authId: 'uuid-auth-1',
        token: 'expired-token',
        expiredAt: pastDate,
        createdAt: new Date(),
      } as AuthToken;

      authTokenRepo.findByToken.mockResolvedValue(expiredToken);

      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        'Token expired',
      );
      expect(authTokenRepo.findByToken).toHaveBeenCalledWith(
        refreshTokenDto.token,
      );
      expect(authTokenRepo.updateExpiredAt).not.toHaveBeenCalled();
    });

    it("devrait renvoyer une erreur si la mise à jour échoue", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 12);

      const mockAuthToken = {
        id: 'uuid-token-1',
        authId: 'uuid-auth-1',
        token: 'valid-token-123',
        expiredAt: futureDate,
        createdAt: new Date(),
      } as AuthToken;

      authTokenRepo.findByToken.mockResolvedValue(mockAuthToken);
      authTokenRepo.updateExpiredAt.mockResolvedValue(null);

      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(refreshTokenDto)).rejects.toThrow(
        'Invalid token',
      );
    });

    it("devrait prolonger l'expiration du token de 24h", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 12);

      const mockAuthToken = {
        id: 'uuid-token-1',
        authId: 'uuid-auth-1',
        token: 'valid-token-123',
        expiredAt: futureDate,
        createdAt: new Date(),
      } as AuthToken;

      const updatedToken = {
        ...mockAuthToken,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      } as AuthToken;

      authTokenRepo.findByToken.mockResolvedValue(mockAuthToken);
      authTokenRepo.updateExpiredAt.mockResolvedValue(updatedToken);

      const beforeExecution = new Date();
      await usecase.execute(refreshTokenDto);
      const afterExecution = new Date();

      const expectedMinExpiration = new Date(beforeExecution);
      expectedMinExpiration.setHours(expectedMinExpiration.getHours() + 24);

      const expectedMaxExpiration = new Date(afterExecution);
      expectedMaxExpiration.setHours(expectedMaxExpiration.getHours() + 24);

      const [[, newExpiredAt]] = authTokenRepo.updateExpiredAt.mock.calls;

      expect(newExpiredAt.getTime()).toBeGreaterThanOrEqual(
        expectedMinExpiration.getTime(),
      );
      expect(newExpiredAt.getTime()).toBeLessThanOrEqual(
        expectedMaxExpiration.getTime(),
      );
    });
  });
});
