import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserDocument } from '../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RoleEnum } from '../config/base-config';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { mapUserToPayload } from '../mappers/mapUserToPayload.mapper';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  const mockUserResponse = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    password: 'testpassword',
    firstname: 'user',
    lastname: 'user',
    email: 'testemail',
    role: RoleEnum.USER,
    __v: 0,
  } as unknown as UserDocument;

  const mockCreateUserDto: CreateUserDto = {
    username: 'testuser',
    email: 'testemail',
    password: 'testpassword',
    firstname: 'user',
    lastname: 'user',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUserResponse),
            findOne: jest.fn().mockReturnValue([mockUserResponse]),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    process.env.SALT_ROUNDS = '10';
  });

  describe('findOne', () => {
    it('should be return the user if it exists', async () => {
      const response = await service.findOne({ email: 'testemail' });
      expect(response).toEqual([mockUserResponse]);
    });

    it('should be return the empty array if it exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue([]);
      const response = await service.findOne({ email: 'testemailFake' });
      expect(response).toEqual([]);
    });
  });
  describe('create', () => {
    it('should be create a new user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      const bcryptHashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword' as never);

      const result = await service.create(mockCreateUserDto);
      expect(model.create).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        password: 'hashedPassword',
      });
      expect(result).toEqual(mapUserToPayload(mockUserResponse));
      expect(bcryptHashSpy).toHaveBeenCalledWith('testpassword', 10);
    });

    it('should be throw an error if email already exists', async () => {
      await expect(
        service.create({ ...mockCreateUserDto, username: 'isNotTheSame' }),
      ).rejects.toThrow('email or username already exists');
    });

    it('should be throw an error if username already exists', async () => {
      await expect(
        service.create({ ...mockCreateUserDto, email: 'isNotTheSame' }),
      ).rejects.toThrow('email or username already exists');
    });
  });

  describe('hashpassword', () => {
    it('should be return the hashed password', async () => {
      const originalPassword = 'testpassword';
      const bcryptHashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword' as never);

      const hashedPassword = await service.hashpassword(originalPassword);

      expect(hashedPassword).toBe('hashedPassword');
      expect(bcryptHashSpy).toHaveBeenCalledWith(originalPassword, 10);
    });
  });
});
