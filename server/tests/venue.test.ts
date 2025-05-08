import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../src/config/config';

const testEmail = 'test@example.com';
const token = jwt.sign({ email: testEmail }, config.JWT_SECRET_KEY!, { expiresIn: '1h' });

const venue = {
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
};

// let venueId: string;

describe('Venue API', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('POST /apis/venues', () => {
    describe('given valid venue data and TheatreAdmin token', () => {
      it('should return 201 with venueId', async () => {
        const res = await supertest(app)
          .post('/apis/venues')
          .set('Cookie', [`token=${token}`])
          .send(venue);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('venueId');
        // venueId = res.body.venueId;
      });
    });

    describe('given duplicate venue name and city', () => {
      it('should return 409', async () => {
        const res = await supertest(app)
          .post('/apis/venues')
          .set('Cookie', [`token=${token}`])
          .send(venue);

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  //   describe('GET /apis/venues/:venueId', () => {
  //     describe('given valid venue ID', () => {
  //       it('should return 200 with venue data', async () => {
  //         const res = await supertest(app).get(`/apis/venues/${venueId}`);

  //         expect(res.status).toBe(200);
  //         expect(res.body).toHaveProperty('venueId');
  //         expect(res.body.name).toBe(venue.name);
  //       });
  //     });

  //     describe('given invalid venue ID', () => {
  //       it('should return 404', async () => {
  //         const res = await supertest(app).get(`/apis/venues/64e40d6cfc13ae41df000000`);
  //         expect(res.status).toBe(404);
  //         expect(res.body).toHaveProperty('message');
  //       });
  //     });
  //   });

  describe('GET /apis/venues/all', () => {
    describe('given valid TheatreAdmin token', () => {
      it('should return 200 and list of venues', async () => {
        const res = await supertest(app)
          .get('/apis/venues/all')
          .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('venues');
        expect(Array.isArray(res.body.venues)).toBeTruthy();
      });
    });
  });
});
