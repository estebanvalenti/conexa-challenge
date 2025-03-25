import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPayloadDto } from '../auth/dto/auth-payload.dto';
import { ApiErrorResponses } from '../common/commons.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthPayloadDto,
  })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or username already exists',
  })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthPayloadDto> {
    return await this.usersService.create(createUserDto);
  }
}
