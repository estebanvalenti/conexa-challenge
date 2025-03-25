import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './test-utils';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { RoleEnum } from '../src/config/base-config';
import { CreateMovieDto } from '../src/movies/dto/create-movie.dto';
import * as nock from 'nock';

describe('Movies E2E', () => {
  let app: INestApplication;
  let agent = {} as request.SuperAgentTest;
  let userAgentToken: string;
  let adminAgentToken: string;
  let connection: Connection;

  const testUser = {
    username: 'testusername',
    email: 'testemail@example.com',
    password: '@Password123',
    firstname: 'user',
    lastname: 'user',
  };

  const adminUser = {
    username: 'adminusername',
    email: 'adminemail@example.com',
    password: '@Password123',
    firstname: 'admin',
    lastname: 'user',
  };
  const path = '/movies/';

  const mockMovieResponse = {
    count: 6,
    next: null,
    previous: null,
    results: [
      {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'Test opening crawl',
        director: 'Test director',
        producer: 'Test producer',
      },
      {
        title: 'A New Hope2',
        episode_id: 5,
        opening_crawl: 'Test opening crawl',
        director: 'Test director',
        producer: 'Test producer',
      },
    ],
  };

  const movies: CreateMovieDto[] = [
    {
      title: 'Test Movie',
      episode_id: 1,
      opening_crawl: 'Test opening crawl',
      director: 'Test director',
      producer: 'Test producer',
    },
    {
      title: 'Test Movie 2',
      episode_id: 2,
      opening_crawl: 'Test opening crawl',
      director: 'Test director',
      producer: 'Test producer',
    },
  ];

  beforeAll(async () => {
    app = await setupTestApp();

    agent = request.agent(
      app.getHttpServer(),
    ) as unknown as request.SuperAgentTest;

    connection = app.get<Connection>(getConnectionToken());
    await agent.post('/users/register').send(testUser).expect(201);
    await agent.post('/users/register').send(adminUser).expect(201);
    const UserModel = connection.model('User');
    const user = await UserModel.findOne({ email: 'adminemail@example.com' });
    user.role = RoleEnum.ADMIN;
    await user.save();

    const userLogin = await agent.post('/auth/login').send(testUser);
    const adminLogin = await agent.post('/auth/login').send(adminUser);
    userAgentToken = userLogin.body.accessToken;
    adminAgentToken = adminLogin.body.accessToken;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      await agent
        .post(path)
        .set('Authorization', `Bearer ${adminAgentToken}`)
        .send(movies[0])
        .expect(201);
      await agent
        .post(path)
        .set('Authorization', `Bearer ${adminAgentToken}`)
        .send(movies[1])
        .expect(201);
    });

    it('should return unauthorized if trying to create a new movie as user', async () => {
      await agent
        .post(path)
        .set('Authorization', `Bearer ${userAgentToken}`)
        .send(movies[0])
        .expect(401);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const response = await agent.get(path).expect(200);
      const movieId = response.body[0]._id;
      await agent
        .put(`${path}${movieId}`)
        .set('Authorization', `Bearer ${adminAgentToken}`)
        .send({ title: 'mynewtitle' })
        .expect(200);
    });

    it('should return unauthorized if trying to update a new movie as user', async () => {
      const response = await agent.get(path).expect(200);
      const movieId = response.body[0]._id;
      await agent
        .put(`${path}${movieId}`)
        .set('Authorization', `Bearer ${userAgentToken}`)
        .send({ title: 'mynewtitle' })
        .expect(401);
    });
  });

  describe('delete', () => {
    it('should return unauthorized if trying to update a new movie as user', async () => {
      const response = await agent.get(path).expect(200);
      const movieId = response.body[0]._id;
      await agent
        .delete(`${path}${movieId}`)
        .set('Authorization', `Bearer ${userAgentToken}`)
        .send()
        .expect(401);
    });
    it('should delete a movie', async () => {
      const response = await agent.get(path).expect(200);

      const movieId = response.body[0]._id;
      await agent
        .delete(`${path}${movieId}`)
        .set('Authorization', `Bearer ${adminAgentToken}`)
        .send()
        .expect(200);
    });
  });

  describe('sync', () => {
    beforeAll(async () => {
      nock('https://swapi.dev/api/films').get('').reply(200, mockMovieResponse);
    });
    it('should sync movies as admin', async () => {
      await agent
        .post(`${path}sync`)
        .set('Authorization', `Bearer ${adminAgentToken}`)
        .send()
        .expect(201);
      const result = await agent.get(path).expect(200);
      expect(result.body.length).toEqual(3);
    });

    it('should return unauthorized when try to sync movies as user', async () => {
      await agent
        .post(`${path}sync`)
        .set('Authorization', `Bearer ${userAgentToken}`)
        .send()
        .expect(401);
    });
  });

  describe('find', () => {
    it('should return a list of movies without auth', async () => {
      const result = await agent.get(path).expect(200);
      expect(result.body.length).toBeGreaterThan(1);
    });

    it('should return a list of movies without auth and match params', async () => {
      const result = await agent
        .get(path)
        .query({ title: 'Test Movie 2' })
        .send()
        .expect(200);
      expect(result.body.length).toEqual(1);
    });

    it('should return a an specific data with user auth', async () => {
      const response = await agent.get(path).expect(200);
      const movieId = response.body[0]._id;
      await agent
        .get(`${path}${movieId}`)
        .set('Authorization', `Bearer ${userAgentToken}`)
        .send()
        .expect(200);
    });
  });
});
