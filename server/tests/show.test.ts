import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../src/config/config';

let showId: string;
let venueId: string;
let movieId: string;

const testEmail = 'test@example.com';
const token = jwt.sign({ email: testEmail }, config.JWT_SECRET_KEY!, { expiresIn: '1h' });

describe('Shows API', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const movieRes = await supertest(app)
      .post('/apis/movies')
      .set('Cookie', [`token=${token}`])
      .send({
        title: 'Interstellar',
        img: 'http://example.com/interstellar.jpg',
        languages: ['English'],
        formats: ['IMAX'],
        genres: ['Sci-Fi'],
        cities: ['New York'],
      });

    movieId = movieRes.body.movieId;

    const venueRes = await supertest(app)
      .post('/apis/venues')
      .set('Cookie', [`token=${token}`])
      .send({
        name: 'Cineplex Hall',
        city: 'New York',
        rows: 10,
        columns: 20,
        sections: [
          {
            name: 'Gold',
            x: 0,
            y: 0,
            rows: 5,
            columns: 10,
            price: 250,
            color: '#FFD700',
          },
          {
            name: 'Silver',
            x: 0,
            y: 6,
            rows: 5,
            columns: 10,
            price: 150,
            color: '#C0C0C0',
          },
        ],
      });

    venueId = venueRes.body.venueId;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /apis/shows', () => {
    describe('when a valid show is created', () => {
      it('should return 201 and success message', async () => {
        const res = await supertest(app)
          .post('/apis/shows')
          .send({
            movieId,
            venueId,
            movieTitle: 'Interstellar',
            language: 'English',
            format: 'IMAX',
            startTime: new Date(),
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('showId');
        showId = res.body.showId;
      });
    });
  });

  describe('GET /apis/shows/:showId', () => {
    describe('when show exists', () => {
      it('should return 200 and show details', async () => {
        const res = await supertest(app).get(`/apis/shows/${showId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('movieId');
        expect(res.body).toHaveProperty('venueId');
      });
    });

    describe('when show is not found', () => {
      it('should return 404', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await supertest(app).get(`/apis/shows/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  describe('GET /apis/shows/venue/:venueId', () => {
    describe('when shows exist for the venue', () => {
      it('should return 200 and show list', async () => {
        const res = await supertest(app).get(`/apis/shows/venue/${venueId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('shows');
        expect(Array.isArray(res.body.shows)).toBe(true);
      });
    });
  });

  describe('GET /apis/shows/:showId/seat-map', () => {
    describe('when seatmap exists', () => {
      it('should return 200 and seatmap data', async () => {
        const res = await supertest(app).get(`/apis/shows/${showId}/seat-map`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('seatmap');
      });
    });

    describe('when seatmap not found', () => {
      it('should return 404', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await supertest(app).get(`/apis/shows/seatmap/${fakeId}`);
        expect(res.status).toBe(404);
      });
    });
  });
});
