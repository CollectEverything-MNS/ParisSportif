import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ForgetPasswordConfirmUseCase } from './forget-password-confirm.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { ForgetPasswordConfirmDto } from './forget-password-confirm.dto';
import { Auth } from '../../entities/auth.entity';
import { AuthToken } from '../../entities/auth-token.entity';
import * as crypto from 'crypto';

describe('ForgetPasswordConfirmUseCase', () => {
  let usecase: ForgetPasswordConfirmUseCase;
  let authRepo: jest.Mocked<IAuthRepository>;
  let tokenRepo: jest.Mocked<IAuthTokenRepository>;

  const mockAuthRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    softDeleteById: jest.fn(),
  };

  const mockTokenRepo = {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByToken: jest.fn(),
    updateExpiredAt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgetPasswordConfirmUseCase,
        {
          provide: IAuthRepository,
          useValue: mockAuthRepo,
        },
        {
          provide: IAuthTokenRepository,
          useValue: mockTokenRepo,
        },
      ],
    }).compile();

    usecase = module.get<ForgetPasswordConfirmUseCase>(
      ForgetPasswordConfirmUseCase,
    );
    authRepo = module.get(IAuthRepository);
    tokenRepo = module.get(IAuthTokenRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const newPassword = 'newSecurePassword123';
    const hashedNewPassword = crypto
      .createHash('sha256')
      .update(newPassword)
      .digest('hex');

    const confirmDto: ForgetPasswordConfirmDto = {
      email: 'test@example.com',
      otp: '123456',
      newPassword,
    };

    const mockAuth = {
      id: 'uuid-confirm-reset',
      email: 'test@example.com',
      password: 'oldHashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      tokens: [],
    } as Auth;

    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 5);

    const mockToken = {
      id: 'uuid-otp-token',
      authId: 'uuid-confirm-reset',
      token: 'OTP_123456',
      expiredAt: futureDate,
      createdAt: new Date(),
    } as AuthToken;

    it('devrait réinitialiser le mot de passe avec un code OTP valide', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(mockToken);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      tokenRepo.deleteByToken.mockResolvedValue(undefined);

      const result = await usecase.execute(confirmDto);

      expect(authRepo.findByEmail).toHaveBeenCalledWith(confirmDto.email);
      expect(tokenRepo.findByToken).toHaveBeenCalledWith('OTP_123456');
      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedNewPassword,
        }),
      );
      expect(tokenRepo.deleteByToken).toHaveBeenCalledWith('OTP_123456');
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it("devrait bloquer si l'utilisateur existe pas", async () => {
      authRepo.findByEmail.mockResolvedValue(null);

      await expect(usecase.execute(confirmDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usecase.execute(confirmDto)).rejects.toThrow(
        'User not found',
      );
      expect(authRepo.findByEmail).toHaveBeenCalledWith(confirmDto.email);
      expect(tokenRepo.findByToken).not.toHaveBeenCalled();
    });

    it('devrait rejeter si le code OTP existe pas', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(null);

      await expect(usecase.execute(confirmDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(confirmDto)).rejects.toThrow('Invalid OTP');
      expect(tokenRepo.deleteByToken).not.toHaveBeenCalled();
    });

    it("devrait rejeter si le code OTP correspond pas à l'utilisateur", async () => {
      const wrongAuthIdToken = {
        ...mockToken,
        authId: 'uuid-wrong-user',
      } as AuthToken;

      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(wrongAuthIdToken);

      await expect(usecase.execute(confirmDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(confirmDto)).rejects.toThrow('Invalid OTP');
      expect(tokenRepo.deleteByToken).not.toHaveBeenCalled();
    });

    it('devrait bloquer si le code OTP est expiré', async () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 5);

      const expiredToken = {
        ...mockToken,
        expiredAt: pastDate,
      } as AuthToken;

      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(expiredToken);

      await expect(usecase.execute(confirmDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(confirmDto)).rejects.toThrow('OTP expired');
      expect(authRepo.save).not.toHaveBeenCalled();
      expect(tokenRepo.deleteByToken).not.toHaveBeenCalled();
    });

    it('devrait hasher le nouveau mot de passe avant de sauvegarder', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(mockToken);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      tokenRepo.deleteByToken.mockResolvedValue(undefined);

      await usecase.execute(confirmDto);

      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedNewPassword,
        }),
      );
    });

    it('devrait supprimer le code OTP après la réinitialisation', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(mockToken);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      tokenRepo.deleteByToken.mockResolvedValue(undefined);

      await usecase.execute(confirmDto);

      expect(tokenRepo.deleteByToken).toHaveBeenCalledWith('OTP_123456');
      expect(tokenRepo.deleteByToken).toHaveBeenCalledTimes(1);
    });

    it('devrait ajouter le préfixe OTP_ au code', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      tokenRepo.findByToken.mockResolvedValue(mockToken);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      tokenRepo.deleteByToken.mockResolvedValue(undefined);

      await usecase.execute(confirmDto);

      expect(tokenRepo.findByToken).toHaveBeenCalledWith(
        `OTP_${confirmDto.otp}`,
      );
    });
  });
});
