import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MoviesModule } from '../movies/movies.module';
import { SyncMoviesService } from './sync.service';

@Module({
  imports: [ScheduleModule.forRoot(), MoviesModule],
  providers: [SyncMoviesService],
  exports: [SyncMoviesService],
})
export class SyncModule {}
