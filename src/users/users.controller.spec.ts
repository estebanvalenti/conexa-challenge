import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RoleEnum } from '../config/base-config';
import mongoose, { Model } from 'mongoose';
import { mapUserToPayload } from '../mappers/mapUserToPayload.mapper';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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

    model = module.get<Model<User>>(getModelToken(User.name));
    process.env.SALT_ROUNDS = '10';
    controller = module.get<UsersController>(UsersController);
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'testemail',
      password: 'testpassword',
      firstname: 'user',
      lastname: 'user',
    };
    it('should create a new user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      const response = await controller.register(createUserDto);
      expect(response).toEqual(mapUserToPayload(mockUserResponse));
    });

    it('should return an error when user already exists', async () => {
      await expect(controller.register(createUserDto)).rejects.toThrow(
        'email or username already exists',
      );
    });
  });
});
