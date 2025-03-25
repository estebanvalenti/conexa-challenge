import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { RoleEnum } from '../config/base-config';
import { Roles } from '../auth/decorators/role.decorator';
import { GetMovieQueryParamsDto } from './dto/get-movie-query-params.dto';
import { Movie } from '../schemas/movies.schema';
import { UpdateMovieParamsDto } from './dto/update-movie.dto';
import { ApiErrorResponses } from '../common/commons.decorator';
import { FetchAndUpsertMoviesResponseDto } from './dto/sync-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary:
      'Get the list of all movies or a list of movies that match with the exactly query',
  })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of movies',
    type: MovieResponseDto,
    isArray: true,
  })
  @Get()
  async getAll(@Query() query: GetMovieQueryParamsDto): Promise<Movie[]> {
    return await this.moviesService.find(query);
  }

  @ApiOperation({ summary: 'Get specific movie by ID' })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A movie that match with the id',
    type: MovieResponseDto,
  })
  @Roles(RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:movieId')
  async getMovie(@Param('movieId') movieId: string): Promise<MovieResponseDto> {
    return await this.moviesService.getMovie(movieId);
  }

  @ApiOperation({ summary: 'create a movie' })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new movie',
    type: MovieResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() movie: CreateMovieDto): Promise<MovieResponseDto> {
    return await this.moviesService.create(movie);
  }

  @ApiOperation({ summary: 'update a movie' })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A movie updated that match with the id',
    type: MovieResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:movieId')
  async update(
    @Param('movieId') movieId: string,
    @Body() movie: UpdateMovieParamsDto,
  ): Promise<MovieResponseDto> {
    return await this.moviesService.update(movieId, movie);
  }

  @ApiOperation({ summary: 'delete a movie' })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A movie deleted that match with the id',
    type: MovieResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:movieId')
  async delete(@Param('movieId') movieId: string): Promise<MovieResponseDto> {
    return await this.moviesService.delete(movieId);
  }

  @ApiOperation({ summary: 'sync movies with endpoint' })
  @ApiErrorResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status of the sync movies',
    type: FetchAndUpsertMoviesResponseDto,
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/sync')
  async sync(): Promise<FetchAndUpsertMoviesResponseDto> {
    return await this.moviesService.fetchAndUpsertMovies();
  }
}
