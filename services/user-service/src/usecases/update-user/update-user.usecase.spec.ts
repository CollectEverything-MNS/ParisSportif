import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.usecase';
import { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from './update-user.dto';
import { RoleType, User } from '../../entities/user.entity';

describe('UpdateUserUseCase', () => {
  let usecase: UpdateUserUseCase;
  let userRepo: jest.Mocked<IUserRepository>;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    usecase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepo = module.get(IUserRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const existingUser = {
      id: 'uuid-123',
      email: 'old@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33612345678',
      address: '10 rue de la Paix',
      postaleCode: '57000',
      city: 'Metz',
      country: 'France',
      role: [RoleType.CUSTOMER],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    } as User;

    it('devrait mettre à jour tous les champs de l\'utilisateur', async () => {
      const updateDto: UpdateUserDto = {
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+33687654321',
        address: '20 avenue de la République',
        postaleCode: '75001',
        city: 'Paris',
        country: 'France',
        role: [RoleType.ADMIN],
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue({
        ...existingUser,
        ...updateDto,
      } as User);

      const result = await usecase.execute('uuid-123', updateDto);

      expect(userRepo.findById).toHaveBeenCalledWith('uuid-123');
      expect(userRepo.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated successfully',
      });
    });

    it('devrait mettre à jour uniquement les champs fournis', async () => {
      const partialUpdateDto: UpdateUserDto = {
        firstName: 'UpdatedName',
        city: 'Lyon',
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue(existingUser);

      const result = await usecase.execute('uuid-123', partialUpdateDto);

      expect(userRepo.findById).toHaveBeenCalledWith('uuid-123');
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated successfully',
      });
    });

    it('devrait lever une NotFoundException si l\'utilisateur n\'existe pas', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      userRepo.findById.mockResolvedValue(null);

      await expect(usecase.execute('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(usecase.execute('invalid-id', updateDto)).rejects.toThrow(
        'User not found',
      );
      expect(userRepo.findById).toHaveBeenCalledWith('invalid-id');
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('devrait bloquer la mise à jour si le nouvel email existe déjà', async () => {
      const updateDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const otherUser = {
        id: 'other-uuid',
        email: 'existing@example.com',
        firstName: 'Other',
        lastName: 'User',
      } as User;

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.findByEmail.mockResolvedValue(otherUser);

      await expect(usecase.execute('uuid-123', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(usecase.execute('uuid-123', updateDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(userRepo.findById).toHaveBeenCalledWith('uuid-123');
      expect(userRepo.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('devrait autoriser la mise à jour avec le même email', async () => {
      const updateDto: UpdateUserDto = {
        email: 'old@example.com',
        firstName: 'UpdatedName',
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue(existingUser);

      const result = await usecase.execute('uuid-123', updateDto);

      expect(userRepo.findById).toHaveBeenCalledWith('uuid-123');
      expect(userRepo.findByEmail).not.toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated successfully',
      });
    });

    it('devrait mettre à jour les rôles de l\'utilisateur', async () => {
      const updateDto: UpdateUserDto = {
        role: [RoleType.ADMIN, RoleType.SUPERADMIN],
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue({
        ...existingUser,
        role: updateDto.role,
      } as User);

      await usecase.execute('uuid-123', updateDto);

      expect(userRepo.save).toHaveBeenCalled();
    });

    it('devrait conserver les champs non fournis', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'UpdatedFirstName',
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue(existingUser);

      await usecase.execute('uuid-123', updateDto);

      const savedUser = userRepo.save.mock.calls[0][0] as User;
      expect(savedUser).toMatchObject({
        email: existingUser.email,
        lastName: existingUser.lastName,
        phone: existingUser.phone,
        address: existingUser.address,
        postaleCode: existingUser.postaleCode,
        city: existingUser.city,
        country: existingUser.country,
        role: existingUser.role,
      });
    });

    it('devrait mettre à jour l\'email si celui-ci est différent et disponible', async () => {
      const updateDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue({
        ...existingUser,
        email: updateDto.email,
      } as User);

      await usecase.execute('uuid-123', updateDto);

      expect(userRepo.findByEmail).toHaveBeenCalledWith(updateDto.email);
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('devrait gérer une mise à jour vide (aucun champ fourni)', async () => {
      const emptyUpdateDto: UpdateUserDto = {};

      userRepo.findById.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue(existingUser);

      const result = await usecase.execute('uuid-123', emptyUpdateDto);

      expect(userRepo.findById).toHaveBeenCalledWith('uuid-123');
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User updated successfully',
      });
    });
  });
});
