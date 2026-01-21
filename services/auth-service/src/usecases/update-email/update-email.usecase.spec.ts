import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UpdateEmailUseCase } from './update-email.usecase';
import { IAuthRepository } from '../../repositories/auth.repository';
import { UpdateEmailDto } from './update-email.dto';
import { Auth } from '../../entities/auth.entity';

describe('UpdateEmailUseCase', () => {
  let usecase: UpdateEmailUseCase;
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
        UpdateEmailUseCase,
        {
          provide: IAuthRepository,
          useValue: mockAuthRepo,
        },
      ],
    }).compile();

    usecase = module.get<UpdateEmailUseCase>(UpdateEmailUseCase);
    authRepo = module.get(IAuthRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const updateEmailDto: UpdateEmailDto = {
      authId: 'uuid-update-email',
      newEmail: 'newemail@example.com',
    };

    const mockAuth = {
      id: 'uuid-update-email',
      email: 'oldemail@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      tokens: [],
    } as Auth;

    it("devrait mettre à jour l'email correctement", async () => {
      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        email: updateEmailDto.newEmail,
      });

      const result = await usecase.execute(updateEmailDto);

      expect(authRepo.findById).toHaveBeenCalledWith(updateEmailDto.authId);
      expect(authRepo.findByEmail).toHaveBeenCalledWith(updateEmailDto.newEmail);
      expect(authRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: updateEmailDto.newEmail,
        })
      );
      expect(result).toBeUndefined();
    });

    it("devrait bloquer si l'utilisateur existe pas", async () => {
      authRepo.findById.mockResolvedValue(null);

      await expect(usecase.execute(updateEmailDto)).rejects.toThrow(Error);
      await expect(usecase.execute(updateEmailDto)).rejects.toThrow('User not found');
      expect(authRepo.findById).toHaveBeenCalledWith(updateEmailDto.authId);
      expect(authRepo.findByEmail).not.toHaveBeenCalled();
      expect(authRepo.save).not.toHaveBeenCalled();
    });

    it('devrait rejeter si le nouvel email existe déjà', async () => {
      const existingAuth = {
        id: 'uuid-existing-email',
        email: 'newemail@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
        tokens: [],
      } as Auth;

      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.findByEmail.mockResolvedValue(existingAuth);

      await expect(usecase.execute(updateEmailDto)).rejects.toThrow(ConflictException);
      await expect(usecase.execute(updateEmailDto)).rejects.toThrow('Email already exists');
      expect(authRepo.findById).toHaveBeenCalledWith(updateEmailDto.authId);
      expect(authRepo.findByEmail).toHaveBeenCalledWith(updateEmailDto.newEmail);
      expect(authRepo.save).not.toHaveBeenCalled();
    });

    it("devrait bien modifier le champ email de l'entité", async () => {
      const authCopy = { ...mockAuth };
      authRepo.findById.mockResolvedValue(authCopy);
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockImplementation((auth) => Promise.resolve(auth));

      await usecase.execute(updateEmailDto);

      expect(authCopy.email).toBe(updateEmailDto.newEmail);
      expect(authCopy.email).not.toBe('oldemail@example.com');
    });

    it("devrait vérifier l'unicité de l'email avant de sauvegarder", async () => {
      authRepo.findById.mockResolvedValue(mockAuth);
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.save.mockResolvedValue({
        ...mockAuth,
        email: updateEmailDto.newEmail,
      });

      await usecase.execute(updateEmailDto);

      expect(authRepo.findByEmail).toHaveBeenCalledWith(updateEmailDto.newEmail);
      expect(authRepo.save).toHaveBeenCalled();
    });
  });
});
