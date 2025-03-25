import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiErrorResponses } from '../common/commons.decorator';
import { LoginDto } from './dto/login-params.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in.',
    type: LoginResponseDto,
  })
  @ApiErrorResponses()
  @Post('login')
  login(@Body() user: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }
}
