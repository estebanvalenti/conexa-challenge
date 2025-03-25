import { FetchAndUpsertMoviesResponseDto } from '../movies/dto/sync-movie.dto';

export function mapMoviesUpdateToResult(
  movies,
  result,
): FetchAndUpsertMoviesResponseDto {
  return {
    fetchedMovies: movies.length,
    updatedMovies: result.modifiedCount,
    createdMovies: result.upsertedCount,
  };
}
