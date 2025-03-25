import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { AdminSeedsService } from './add-admin.seed';
import { SeedersService } from './seeders.service';
import { UsersModule } from '../../users/users.module';
import { DbModule } from '../db.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    DbModule,
  ],
  providers: [AdminSeedsService, SeedersService],
  exports: [AdminSeedsService],
})
export class SeedersModule {}
