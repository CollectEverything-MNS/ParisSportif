import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { IAuthTokenRepository } from '../../repositories/auth-token.repository';
import { LoginDto } from './login.dto';
import { Auth } from '../../entities/auth.entity';
import { AuthToken } from '../../entities/auth-token.entity';
import * as crypto from 'crypto';

describe('LoginUseCase', () => {
  let usecase: LoginUseCase;
  let authRepo: jest.Mocked<IAuthRepository>;
  let authTokenRepo: jest.Mocked<IAuthTokenRepository>;

  const mockAuthRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    softDeleteById: jest.fn(),
  };

  const mockAuthTokenRepo = {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByToken: jest.fn(),
    updateExpiredAt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: IAuthRepository,
          useValue: mockAuthRepo,
        },
        {
          provide: IAuthTokenRepository,
          useValue: mockAuthTokenRepo,
        },
      ],
    }).compile();

    usecase = module.get<LoginUseCase>(LoginUseCase);
    authRepo = module.get(IAuthRepository);
    authTokenRepo = module.get(IAuthTokenRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const hashedPassword = crypto.createHash('sha256').update('password123').digest('hex');

    const mockAuth = {
      id: 'uuid-123',
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      tokens: [],
    } as Auth;

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      authTokenRepo.save.mockResolvedValue({} as AuthToken);

      const result = await usecase.execute(loginDto);

      expect(authRepo.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(authTokenRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiredAt');
      expect(typeof result.token).toBe('string');
      expect(result.expiredAt).toBeInstanceOf(Date);
    });

    it("devrait renvoyer une erreur quand l'utilisateur existe pas", async () => {
      authRepo.findByEmail.mockResolvedValue(null);

      await expect(usecase.execute(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(usecase.execute(loginDto)).rejects.toThrow('User not found');
      expect(authRepo.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(authTokenRepo.save).not.toHaveBeenCalled();
    });

    it('devrait rejeter la connexion si le mot de passe est faux', async () => {
      const wrongPasswordDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authRepo.findByEmail.mockResolvedValue(mockAuth);

      await expect(usecase.execute(wrongPasswordDto)).rejects.toThrow(UnauthorizedException);
      await expect(usecase.execute(wrongPasswordDto)).rejects.toThrow('Invalid credentials');
      expect(authRepo.findByEmail).toHaveBeenCalledWith(wrongPasswordDto.email);
      expect(authTokenRepo.save).not.toHaveBeenCalled();
    });

    it('devrait créer un token qui expire dans 24 heures', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      authTokenRepo.save.mockResolvedValue({} as AuthToken);

      const beforeExecution = new Date();
      const result = await usecase.execute(loginDto);
      const afterExecution = new Date();

      const expectedMinExpiration = new Date(beforeExecution);
      expectedMinExpiration.setHours(expectedMinExpiration.getHours() + 24);

      const expectedMaxExpiration = new Date(afterExecution);
      expectedMaxExpiration.setHours(expectedMaxExpiration.getHours() + 24);

      expect(result.expiredAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiration.getTime());
      expect(result.expiredAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiration.getTime());
    });

    it('devrait sauvegarder le token avec les bonnes infos', async () => {
      authRepo.findByEmail.mockResolvedValue(mockAuth);
      authTokenRepo.save.mockResolvedValue({} as AuthToken);

      await usecase.execute(loginDto);

      expect(authTokenRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          authId: mockAuth.id,
          token: expect.any(String),
          expiredAt: expect.any(Date),
        })
      );
    });
  });
});
