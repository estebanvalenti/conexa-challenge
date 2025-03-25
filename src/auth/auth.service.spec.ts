import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../schemas/user.schema';
import { RoleEnum } from '../config/base-config';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login-params.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const user = {
      _id: new mongoose.Types.ObjectId(),
      username: 'testuser',
      password: 'testpassword',
      firstname: 'user',
      lastname: 'user',
      role: RoleEnum.USER,
      __v: 0,
    } as unknown as UserDocument;
    const mockLoginDto: LoginDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('should login and return access token', () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      expect(service.login(mockLoginDto)).resolves.toEqual({
        accessToken: 'token',
      });
    });

    it('should return error if user not found', () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials provided.',
      );
    });

    it('should return error if password is invalid', () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials provided.',
      );
    });
  });
});
