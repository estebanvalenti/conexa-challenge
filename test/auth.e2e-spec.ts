import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './test-utils';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Auth E2E', () => {
  let app: INestApplication;
  let agent = {} as request.SuperAgentTest;
  let connection: Connection;

  const testUser = {
    username: 'testusername',
    email: 'testemail@example.com',
    password: '@Password123',
    firstname: 'user',
    lastname: 'user',
  };
  const path = '/auth/login';

  beforeAll(async () => {
    app = await setupTestApp();

    agent = request.agent(
      app.getHttpServer(),
    ) as unknown as request.SuperAgentTest;

    connection = app.get<Connection>(getConnectionToken());
    await agent.post('/users/register').send(testUser).expect(201);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  it('should login correctly', async () => {
    const response = await agent
      .post(path)
      .send({ username: testUser.username, password: testUser.password })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
  });

  it('should return an error if have missing fields', async () => {
    const response = await agent.post(path).send().expect(400);

    expect(response.body).toEqual({
      message: [
        'username should not be empty',
        'username must be a string',
        'password should not be empty',
        'password must be a string',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should return unauthorized if user data is wrong', async () => {
    const response = await agent
      .post(path)
      .send({ username: 'asd', password: '123' })
      .expect(401);
    expect(response.body).toEqual({
      message: 'Invalid credentials provided.',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });
});
