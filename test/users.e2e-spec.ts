import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './test-utils';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Users E2E', () => {
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

  beforeAll(async () => {
    app = await setupTestApp();

    agent = request.agent(
      app.getHttpServer(),
    ) as unknown as request.SuperAgentTest;

    connection = app.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await agent
      .post('/users/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.email).toEqual(testUser.email);
  });

  it('should return an error if user have missing fields', async () => {
    const response = await agent.post('/users/register').send().expect(400);

    expect(response.body).toEqual({
      message: [
        'username must be longer than or equal to 4 characters',
        'username should not be empty',
        'username must be a string',
        'firstname should not be empty',
        'firstname must be a string',
        'lastname should not be empty',
        'lastname must be a string',
        'email must be an email',
        'email should not be empty',
        'password is too weak',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
        'password should not be empty',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should return conflict if user already exists', async () => {
    await agent.post('/users/register').send(testUser).expect(409);
  });
});
