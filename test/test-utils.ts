import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import baseConfig, {
  EnviromentEnum,
  EnviromentFileEnum,
} from '../src/config/base-config';
import { DbModule } from '../src/db/db.module';
import { SeedersModule } from '../src/db/seeders/seeders.module';
import { MoviesModule } from '../src/movies/movies.module';
import { SyncModule } from '../src/sync/sync.module';
import { UsersModule } from '../src/users/users.module';

let app: INestApplication;
let testingModule: TestingModule;

export const setupTestApp = async (): Promise<INestApplication> => {
  testingModule = await Test.createTestingModule({
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
  }).compile();
  app = await testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app;
};
