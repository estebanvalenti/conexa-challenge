import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MoviesService } from 'src/movies/movies.service';

@Injectable()
export class SyncMoviesService {
  constructor(private moviesServices: MoviesService) {}

  private readonly logger = new Logger(SyncMoviesService.name);

  @Cron('0 0 * * *', { timeZone: 'GMT' })
  async handleSyncMovies() {
    try {
      const result = await this.moviesServices.fetchAndUpsertMovies();
      this.logger.log(
        `Synced movies, result: ${result.createdMovies} new movies and ${result.updatedMovies} movies updated.`,
      );
    } catch (error) {
      this.logger.error('Error during movie sync', error);
    }
  }
}
