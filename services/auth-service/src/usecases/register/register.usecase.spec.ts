import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from './register.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { RegisterDto } from './register.dto';
import { Auth } from '../../entities/auth.entity';
import { of } from 'rxjs';
import * as crypto from 'crypto';

describe('RegisterUseCase', () => {
  let usecase: RegisterUseCase;
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
        RegisterUseCase,
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

    usecase = module.get<RegisterUseCase>(RegisterUseCase);
    authRepo = module.get(IAuthRepository);
    rmqClient = module.get('RMQ_CLIENT');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const hashedPassword = crypto
      .createHash('sha256')
      .update('password123')
      .digest('hex');

    const savedAuth = {
      id: 'uuid-456',
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      tokens: [],
    } as Auth;

    it('devrait créer un nouvel utilisateur correctement', async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue(savedAuth);
      rmqClient.emit.mockReturnValue(of({}));

      const result = await usecase.execute(registerDto);

      expect(authRepo.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: hashedPassword,
        }),
      );
      expect(rmqClient.emit).toHaveBeenCalledWith('auth.registered', {
        authId: savedAuth.id,
        email: savedAuth.email,
      });
      expect(result).toEqual({
        id: savedAuth.id,
        email: savedAuth.email,
        createdAt: savedAuth.createdAt,
      });
    });

    it("devrait bloquer l'inscription si l'email existe déjà", async () => {
      const existingAuth = {
        id: 'uuid-existing',
        email: 'test@example.com',
        password: 'hashedpass',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
        tokens: [],
      } as Auth;

      authRepo.findByEmail.mockResolvedValue(existingAuth);

      await expect(usecase.execute(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(usecase.execute(registerDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(authRepo.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(authRepo.save).not.toHaveBeenCalled();
      expect(rmqClient.emit).not.toHaveBeenCalled();
    });

    it('devrait hasher le mot de passe avant de sauvegarder', async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue(savedAuth);
      rmqClient.emit.mockReturnValue(of({}));

      await usecase.execute(registerDto);

      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringContaining(registerDto.password),
        }),
      );
    });

    it('devrait envoyer un event RabbitMQ après inscription', async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue(savedAuth);
      rmqClient.emit.mockReturnValue(of({}));

      await usecase.execute(registerDto);

      expect(rmqClient.emit).toHaveBeenCalledTimes(1);
      expect(rmqClient.emit).toHaveBeenCalledWith('auth.registered', {
        authId: savedAuth.id,
        email: savedAuth.email,
      });
    });

    it('devrait retourner les données utilisateur sans le mot de passe', async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue(savedAuth);
      rmqClient.emit.mockReturnValue(of({}));

      const result = await usecase.execute(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
    });
  });
});
