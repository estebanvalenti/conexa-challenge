import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Movie, MovieDocument } from '../schemas/movies.schema';
import mongoose, { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';

global.fetch = jest.fn();
describe('MoviesController', () => {
  let controller: MoviesController;
  let model: Model<Movie>;

  const mockMovie = {
    _id: new mongoose.Types.ObjectId(12),
    title: 'sometitle',
    episode_id: 123,
    opening_crawl: 'some crawl',
    director: 'some director',
    producer: 'some producer',
    release_date: new Date('2024-04-23'),
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    created: new Date(),
    edited: new Date(),
    url: 'someurl',
  } as any as MovieDocument;

  const mockNewMovie = {
    title: 'newmovie',
    episode_id: 4,
    opening_crawl: 'It is a new movie',
    director: 'somedirector',
    producer: 'someproducer',
    release_date: new Date('2024-05-23'),
  } as any as MovieDocument;

  const mockBulkWriteResult = {
    modifiedCount: 1,
    upsertedCount: 1,
  } as any;

  const swapiMoviesResponse = {
    results: [
      {
        title: 'sometitle',
        episode_id: 123,
        opening_crawl: 'some crawl',
        director: 'some director',
        producer: 'some producer',
        release_date: new Date('2024-04-23'),
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: new Date(),
        edited: new Date(),
        url: 'someurl',
      },
      {
        title: 'sometitle',
        episode_id: 123,
        opening_crawl: 'some crawl',
        director: 'some director',
        producer: 'some producer',
        release_date: new Date('2024-04-23'),
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: new Date(),
        edited: new Date(),
        url: 'someurl',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: {
            find: jest.fn().mockReturnValue([mockMovie]),
            findById: jest.fn().mockReturnValue(mockMovie),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn().mockReturnValue(mockNewMovie),
            bulkWrite: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    model = module.get(getModelToken(Movie.name));
    controller = module.get<MoviesController>(MoviesController);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      expect(await controller.getAll({})).toEqual([mockMovie]);
    });
  });

  describe('findOne', () => {
    it('should return a specific movie that match the id', async () => {
      expect(await controller.getMovie('12')).toEqual(mockMovie);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      expect(await controller.create(mockNewMovie)).toEqual(mockNewMovie);
    });
  });

  describe('update', () => {
    it('should update the title of the movie', async () => {
      const updatedMovie = { ...mockMovie, title: 'mynewtitle' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedMovie);

      expect(await controller.update('12', { title: 'mynewtitle' })).toEqual({
        ...mockMovie,
        title: 'mynewtitle',
      });
    });
  });

  describe('delete', () => {
    it('should delete the movie', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockMovie);

      expect(await controller.delete('12')).toEqual(mockMovie);
    });
  });

  describe('sync', () => {
    it('should fetch and upsert movies', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(swapiMoviesResponse),
      });
      jest.spyOn(model, 'bulkWrite').mockResolvedValue(mockBulkWriteResult);

      const expectedResult = {
        fetchedMovies: swapiMoviesResponse.results.length,
        updatedMovies: mockBulkWriteResult.modifiedCount,
        createdMovies: mockBulkWriteResult.upsertedCount,
      };
      expect(await controller.sync()).toEqual(expectedResult);
    });
  });
});
