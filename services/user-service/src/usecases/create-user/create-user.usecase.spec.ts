import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.usecase';
import { IUserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './create-user.dto';
import { RoleType, User } from '../../entities/user.entity';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;
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
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    usecase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepo = module.get(IUserRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33612345678',
      address: '10 rue de la Paix',
      postaleCode: '57000',
      city: 'Metz',
      country: 'France',
      role: [RoleType.CUSTOMER],
    };

    const savedUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33612345678',
      address: '10 rue de la Paix',
      postaleCode: '57000',
      city: 'Metz',
      country: 'France',
      role: [RoleType.CUSTOMER],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    it('devrait créer un nouvel utilisateur avec tous les champs', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue(savedUser);

      const result = await usecase.execute(createUserDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          phone: createUserDto.phone,
          address: createUserDto.address,
          postaleCode: createUserDto.postaleCode,
          city: createUserDto.city,
          country: createUserDto.country,
          role: createUserDto.role,
        })
      );
      expect(result).toEqual({
        message: 'User created successfully',
      });
    });

    it('devrait créer un utilisateur avec uniquement les champs obligatoires', async () => {
      const minimalDto: CreateUserDto = {
        email: 'minimal@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: [RoleType.CUSTOMER],
      };

      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue({
        ...savedUser,
        email: minimalDto.email,
        firstName: minimalDto.firstName,
        lastName: minimalDto.lastName,
        phone: '',
        address: '',
        postaleCode: '',
        city: '',
        country: '',
      });

      const result = await usecase.execute(minimalDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.findByEmail).toHaveBeenCalledWith(minimalDto.email);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: minimalDto.email,
          firstName: minimalDto.firstName,
          lastName: minimalDto.lastName,
          phone: '',
          address: '',
          postaleCode: '',
          city: '',
          country: '',
        })
      );
      expect(result).toEqual({
        message: 'User created successfully',
      });
    });

    it("devrait bloquer la création si l'email existe déjà", async () => {
      const existingUser = {
        id: 'uuid-existing',
        email: 'test@example.com',
        firstName: 'Existing',
        lastName: 'User',
        phone: '',
        address: '',
        postaleCode: '',
        city: '',
        country: '',
        role: [RoleType.CUSTOMER],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userRepo.findByEmail.mockResolvedValue(existingUser);

      await expect(usecase.execute(createUserDto)).rejects.toThrow(BadRequestException);
      await expect(usecase.execute(createUserDto)).rejects.toThrow('Email already exists');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('devrait créer un utilisateur avec plusieurs rôles', async () => {
      const multiRoleDto: CreateUserDto = {
        ...createUserDto,
        role: [RoleType.CUSTOMER, RoleType.ADMIN],
      };

      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue({
        ...savedUser,
        role: [RoleType.CUSTOMER, RoleType.ADMIN],
      });

      await usecase.execute(multiRoleDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          role: [RoleType.CUSTOMER, RoleType.ADMIN],
        })
      );
    });

    it('devrait utiliser le rôle CUSTOMER par défaut si la liste de rôles est vide', async () => {
      const emptyRoleDto = {
        ...createUserDto,
        role: [] as RoleType[],
      };

      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue(savedUser);

      await usecase.execute(emptyRoleDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          role: [RoleType.CUSTOMER],
        })
      );
    });

    it('devrait convertir les champs optionnels undefined en chaînes vides', async () => {
      const dtoWithUndefined: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: [RoleType.CUSTOMER],
      };

      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue(savedUser);

      await usecase.execute(dtoWithUndefined);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '',
          address: '',
          postaleCode: '',
          city: '',
          country: '',
        })
      );
    });
  });
});
