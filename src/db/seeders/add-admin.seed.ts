import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnviromentEnum, RoleEnum } from 'src/config/base-config';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminSeedsService {
  private readonly logger = new Logger(AdminSeedsService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userService: UsersService,
  ) {}

  async seedAdminUser() {
    if (process.env.ENV === EnviromentEnum.DEV) {
      try {
        const password = await this.userService.hashpassword('admin');
        const user: User = {
          username: 'admin',
          email: 'admin@admin.com',
          password: password,
          firstname: 'Admin',
          lastname: 'User',
          role: RoleEnum.ADMIN,
        };
        await this.userModel.findOneAndUpdate({ email: user.email }, user, {
          upsert: true,
          new: true,
        });
        this.logger.log(
          'Seeder was ran successfully to create an test admin user',
        );
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
  async seed() {
    await this.seedAdminUser();
  }
}
