import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import baseConfig, {
  EnviromentEnum,
  EnviromentFileEnum,
} from './config/base-config';
import { ScheduleModule } from '@nestjs/schedule';
import { SeedersModule } from './db/seeders/seeders.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    UsersModule,
    MoviesModule,
    SeedersModule,
    SyncModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig],
      envFilePath:
        process.env.ENV === EnviromentEnum.PROD
          ? EnviromentFileEnum.PROD
          : EnviromentFileEnum.DEV,
    }),
  ],
})
export class AppModule {}
