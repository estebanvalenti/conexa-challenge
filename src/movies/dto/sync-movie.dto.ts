import { ApiProperty } from '@nestjs/swagger';

export class FetchAndUpsertMoviesResponseDto {
  @ApiProperty()
  fetchedMovies: number;
  @ApiProperty()
  updatedMovies: number;
  @ApiProperty()
  createdMovies: number;
}
