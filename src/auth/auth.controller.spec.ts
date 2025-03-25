import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-params.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('should login', async () => {
      const loginResponse: LoginResponseDto = { accessToken: 'token' };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      await expect(controller.login(loginDto)).resolves.toEqual(loginResponse);
    });

    it('should return an unauthorized error if credentials do not match', async () => {
      const error = new UnauthorizedException('Invalid credentials provided.');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
