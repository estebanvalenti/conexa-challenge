import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { mapUserToPayload } from '../mappers/mapUserToPayload.mapper';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login-params.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto): Promise<LoginResponseDto> {
    username = username.toLowerCase();
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    const payload = mapUserToPayload(user);
    const accessToken = await this.jwtService.sign({
      payload,
      expiresIn: '1h',
    });

    return { accessToken };
  }
}
