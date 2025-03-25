import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../schemas/movies.schema';
import { GetMovieQueryParamsDto } from './dto/get-movie-query-params.dto';
import { mapMoviesUpdateToResult } from '../mappers/mapMoviesUpdateToResult.mapper';
import { FetchAndUpsertMoviesResponseDto } from './dto/sync-movie.dto';
import { BASE_SWAPI_URL } from '../config/base-config';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
  ) {}

  async find(params: GetMovieQueryParamsDto): Promise<Movie[]> {
    return await this.movieModel.find(params);
  }

  async getMovie(movieId: string): Promise<Movie> {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async update(movieId: string, movie: Partial<Movie>): Promise<Movie> {
    return await this.movieModel.findByIdAndUpdate(movieId, movie, {
      new: true,
    });
  }

  async delete(movieId: string): Promise<Movie> {
    return await this.movieModel.findByIdAndDelete(movieId);
  }

  async create(movie: Partial<Movie>): Promise<Movie> {
    return await this.movieModel.create(movie);
  }

  async fetchAndUpsertMovies(): Promise<FetchAndUpsertMoviesResponseDto> {
    try {
      const response = await fetch(`${BASE_SWAPI_URL}/films`);

      const data = await response.json();

      if (!data || !data.results) {
        throw new Error('Failed to fetch movies from SWAPI');
      }

      const movies = data.results;

      const bulkOps = movies.map((movieData) => ({
        updateOne: {
          filter: { title: movieData.title },
          update: { $set: { ...movieData } },
          upsert: true,
        },
      }));

      const result = await this.movieModel.bulkWrite(bulkOps);
      const mappedResult = mapMoviesUpdateToResult(movies, result);
      return mappedResult;
    } catch (error) {
      throw error;
    }
  }
}
