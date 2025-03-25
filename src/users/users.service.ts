import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPayloadDto } from '../auth/dto/auth-payload.dto';
import * as bcrypt from 'bcrypt';
import { mapUserToPayload } from '../mappers/mapUserToPayload.mapper';

interface IFilterUser {
  username?: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<AuthPayloadDto> {
    createUserDto.username = createUserDto.username.toLowerCase();
    const user: User = await this.findOne({
      username: createUserDto.username,
      email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('email or username already exists');
    }

    const hashedPassword = await this.hashpassword(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return mapUserToPayload(newUser);
  }

  async findOne(filter: IFilterUser): Promise<UserDocument | null> {
    const query: FilterQuery<User> = {
      $or: [{ username: filter.username }, { email: filter.email }],
    };

    return await this.userModel.findOne(query);
  }

  async hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
  }
}
