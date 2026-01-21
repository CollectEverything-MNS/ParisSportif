import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChangePasswordUseCase } from './change-password.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { ChangePasswordDto } from './change-password.dto';
import { Auth } from '../../entities/auth.entity';
import { of } from 'rxjs';
import * as crypto from 'crypto';

describe('ChangePasswordUseCase', () => {
  let usecase: ChangePasswordUseCase;
  let authRepo: jest.Mocked<IAuthRepository>;
  let rmqClient: any;

  const mockAuthRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    softDeleteById: jest.fn(),
  };

  const mockRmqClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordUseCase,
        {
          provide: IAuthRepository,
          useValue: mockAuthRepo,
        },
        {
          provide: 'RMQ_CLIENT',
          useValue: mockRmqClient,
        },
      ],
    }).compile();

    usecase = module.get<ChangePasswordUseCase>(ChangePasswordUseCase);
    authRepo = module.get(IAuthRepository);
    rmqClient = module.get('RMQ_CLIENT');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const oldPassword = 'oldPassword123';
    const newPassword = 'newPassword456';

    const hashedOldPassword = crypto
      .createHash('sha256')
      .update(oldPassword)
      .digest('hex');

    const hashedNewPassword = crypto
      .createHash('sha256')
      .update(newPassword)
      .digest('hex');

    const changePasswordDto: ChangePasswordDto = {
      authId: 'uuid-789',
      oldPassword,
      newPassword,
    };

    const mockAuth = {
      id: 'uuid-789',
      email: 'test@example.com',
      password: hashedOldPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      tokens: [],
    } as Auth;

    it('devrait changer le mot de passe avec succès', async () => {
      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      rmqClient.emit.mockReturnValue(of({}));

      const result = await usecase.execute(changePasswordDto);

      expect(authRepo.findById).toHaveBeenCalledWith(changePasswordDto.authId);
      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockAuth.id,
          password: hashedNewPassword,
        }),
      );
      expect(rmqClient.emit).toHaveBeenCalledWith('password.changed', {
        authId: mockAuth.id,
        password: hashedNewPassword,
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it("devrait rejeter si l'utilisateur existe pas", async () => {
      authRepo.findById.mockResolvedValue(null);

      await expect(usecase.execute(changePasswordDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usecase.execute(changePasswordDto)).rejects.toThrow(
        'User not found',
      );
      expect(authRepo.findById).toHaveBeenCalledWith(changePasswordDto.authId);
      expect(authRepo.save).not.toHaveBeenCalled();
      expect(rmqClient.emit).not.toHaveBeenCalled();
    });

    it("devrait bloquer si l'ancien mot de passe est incorrect", async () => {
      const wrongOldPasswordDto: ChangePasswordDto = {
        authId: 'uuid-789',
        oldPassword: 'wrongPassword',
        newPassword,
      };

      authRepo.findById.mockResolvedValue(mockAuth);

      await expect(usecase.execute(wrongOldPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute(wrongOldPasswordDto)).rejects.toThrow(
        'Invalid old password',
      );
      expect(authRepo.save).not.toHaveBeenCalled();
      expect(rmqClient.emit).not.toHaveBeenCalled();
    });

    it('devrait hasher le nouveau mot de passe avant de sauvegarder', async () => {
      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      rmqClient.emit.mockReturnValue(of({}));

      await usecase.execute(changePasswordDto);

      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedNewPassword,
        }),
      );
    });

    it('devrait envoyer un event RabbitMQ après le changement', async () => {
      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        password: hashedNewPassword,
      });
      rmqClient.emit.mockReturnValue(of({}));

      await usecase.execute(changePasswordDto);

      expect(rmqClient.emit).toHaveBeenCalledTimes(1);
      expect(rmqClient.emit).toHaveBeenCalledWith('password.changed', {
        authId: mockAuth.id,
        password: hashedNewPassword,
      });
    });

    it('devrait bien mettre à jour le mot de passe dans la entity', async () => {
      const authCopy = { ...mockAuth };
      authRepo.findById.mockResolvedValue(authCopy);
      authRepo.save.mockImplementation((auth) => Promise.resolve(auth));
      rmqClient.emit.mockReturnValue(of({}));

      await usecase.execute(changePasswordDto);

      expect(authCopy.password).toBe(hashedNewPassword);
      expect(authCopy.password).not.toBe(hashedOldPassword);
    });
  });
});
