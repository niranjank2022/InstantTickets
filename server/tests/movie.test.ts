import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../src/config/config';

const movie = {
  title: 'Inception',
  img: 'http://example.com/inception.jpg',
  languages: ['English', 'Spanish'],
  formats: ['2D', 'IMAX'],
  genres: ['Sci-Fi', 'Thriller'],
  cities: ['New York', 'Los Angeles'],
};
const testEmail = 'test@example.com';
const token = jwt.sign({ email: testEmail }, config.JWT_SECRET_KEY!, {
  expiresIn: '1hr',
});

let movieId: string;

describe('Movie API', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /apis/movie/', () => {
    describe('given valid movie data and MovieAdmin token', () => {
      it('should return 201 with movieId', async () => {
        const response = await supertest(app)
          .post('/apis/movies')
          .set('Cookie', [`token=${token}`])
          .send(movie);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('movieId');
        movieId = response.body.movieId;
      });
    });

    describe('given no token is passed in cookies', () => {
      it('should return 401 and message', async () => {
        const response = await supertest(app).post('/apis/movies').send(movie);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('given the token is invalid', () => {
      it('should return 403 and message', async () => {
        const response = await supertest(app).post('/apis/movies').set('Cookie', ['token=invalidtoken']).send(movie);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('given the token is expired', () => {
      it('should return 401 and message', async () => {
        const expiredToken = jwt.sign({ email: testEmail }, config.JWT_SECRET_KEY!, {
          expiresIn: '1s',
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await supertest(app)
          .post('/apis/movies')
          .set('Cookie', [`token=${expiredToken}`])
          .send(movie);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
      });
    });
  });

  describe('PUT /apis/movies/:movieId', () => {
    describe('given the request is valid and movie is updated', () => {
      it('should return 200 and message', async () => {
        const updatedMovie = {
          title: 'Updated Movie',
          img: 'https://image.jpg',
          languages: ['English', 'Tamil'],
          formats: ['2D', '3D'],
          genres: ['Action', 'Thriller'],
          cities: ['Chennai', 'Delhi'],
        };
        const res = await supertest(app)
          .put(`/apis/movies/${movieId}`)
          .set('Cookie', [`token=${token}`])
          .send(updatedMovie);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  describe('GET /apis/movies/all', () => {
    describe('given the request is valid and movies are returned', () => {
      it('should return 200 and movies', async () => {
        const res = await supertest(app)
          .get('/apis/movies/all')
          .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('movies');
      });
    });
  });

  describe('GET /apis/movies/city/:cityId', () => {
    describe('given the request is valid and movies are returned', () => {
      it('should return 200 and movies', async () => {
        const res = await supertest(app)
          .get('/apis/movies/city/New York')
          .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('movies');
      });
    });
  });
});
