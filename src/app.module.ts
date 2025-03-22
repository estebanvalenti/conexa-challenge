import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import baseConfig from './config/base-config';

@Module({
  imports: [
    AuthModule,
    DbModule,
    UsersModule,
    MoviesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig],
      envFilePath: process.env.ENV === 'prod' ? '.env.prod' : '.env.dev',
    }),
  ],
})
export class AppModule {}
