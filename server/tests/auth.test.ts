import mongoose from 'mongoose';
import app from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

const user = {
  email: 'email123@gmail.com',
  password: 'password123',
  role: 'USER',
};

describe('Auth API', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /apis/auth/signup', () => {
    describe('given the request is valid and user doesn"t exist', () => {
      it('should return 201 and contain userId', async () => {
        const res = await supertest(app).post('/apis/auth/signup').send(user);
        const cookies = res.headers['set-cookie'];

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('userId');
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^token=/)]));
      });
    });

    describe('given user already exist', () => {
      it('should return 409 and error message', async () => {
        const res = await supertest(app).post('/apis/auth/signup').send(user);

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message');
      });
    });

    describe('given the request is invalid', () => {
      it('should return 400 and error message', async () => {
        const res = await supertest(app)
          .post('/apis/auth/signup')
          .send({ email: 'www.google.in', password: '123abc', role: 'AVENGER' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  describe('POST /apis/auth/signin', () => {
    describe('given the request is valid and user exist', () => {
      it('should return 201 and contain userId', async () => {
        const res = await supertest(app).post('/apis/auth/signin').send(user);
        const cookies = res.headers['set-cookie'];

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('userId');
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^token=/)]));
      });
    });

    describe('given the user do not exist', () => {
      it('should return 404 and error message', async () => {
        const res = await supertest(app)
          .post('/apis/auth/signin')
          .send({ email: 'user456@gmail.com', password: 'pass234', role: 'THEATRE_ADMIN' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
      });
    });

    describe('given the request is invalid', () => {
      it('should return 400 and error message', async () => {
        const res = await supertest(app)
          .post('/apis/auth/signin')
          .send({ email: 'www.google.in', password: '123abc', role: 'AVENGER' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  describe('POST /apis/auth/logout', () => {
    describe('given logged in user logs out', () => {
      it('should return 200 and clear cookie', async () => {
        const res = await supertest(app).post('/apis/auth/logout');
        const cookies = res.headers['set-cookie'];

        expect(res.status).toBe(200);
        expect(cookies).toBeDefined();
        expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^token=;.*Max-Age=0|Expires=/)]));
      });
    });
  });
});
