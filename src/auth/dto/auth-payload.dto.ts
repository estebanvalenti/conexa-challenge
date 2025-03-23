import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/config/base-config';

export class AuthPayloadDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  role: RoleEnum;
}
