import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import mongoose, { Model } from 'mongoose';
import { Movie, MovieDocument } from '../schemas/movies.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BASE_SWAPI_URL } from '../config/base-config';

global.fetch = jest.fn();

describe('MoviesService', () => {
  let service: MoviesService;
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
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get(getModelToken(Movie.name));
  });

  describe('find', () => {
    it('should return an array of movies', async () => {
      const moviesArray = [mockMovie];

      const result = await service.find({});
      expect(result).toEqual(moviesArray);
    });

    it('should return a specific movie that match the title', async () => {
      const moviesArray = [mockMovie];

      const result = await service.find({ title: 'sometitle' });
      expect(result).toEqual(moviesArray);
      expect(model.find).toHaveBeenCalledWith({ title: 'sometitle' });
    });

    it('should return a specific movie that match the id', async () => {
      const result = await service.getMovie('12');
      expect(result).toEqual(mockMovie);
    });

    it('should throw an error if movie not found by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.getMovie('nonexistent')).rejects.toThrow(
        'Movie not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieData = {
        title: 'newmovie',
        episode_id: 4,
        opening_crawl: 'It is a new movie',
        director: 'somedirector',
        producer: 'someproducer',
        release_date: new Date('2024-05-23'),
      };

      const result = await service.create(createMovieData);
      expect(model.create).toHaveBeenCalledWith(createMovieData);
      expect(result).toEqual(mockNewMovie);
    });
  });

  describe('update', () => {
    it('should update the title of the movie', async () => {
      const updatedMovie = { ...mockMovie, title: 'mynewtitle' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedMovie);

      const result = await service.update('12', {
        title: 'mynewtitle',
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        '12',
        { title: 'mynewtitle' },
        { new: true },
      );
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('delete', () => {
    it('should delete the movie', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockMovie);

      const result = await service.delete('12');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('12');
      expect(result).toEqual(mockMovie);
    });
  });

  describe('fetchAndUpsertMovies', () => {
    it('should fetch and update all movies', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(swapiMoviesResponse),
      });
      jest.spyOn(model, 'bulkWrite').mockResolvedValue(mockBulkWriteResult);

      const expectedResult = {
        fetchedMovies: swapiMoviesResponse.results.length,
        updatedMovies: mockBulkWriteResult.modifiedCount,
        createdMovies: mockBulkWriteResult.upsertedCount,
      };

      const result = await service.fetchAndUpsertMovies();
      expect(global.fetch).toHaveBeenCalledWith(`${BASE_SWAPI_URL}/films`);
      expect(model.bulkWrite).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
