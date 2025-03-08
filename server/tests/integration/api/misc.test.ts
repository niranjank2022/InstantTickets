import request from 'supertest';
import app from '../../../src/app';

describe('Unknown API called', () => {
  it('should log the error when GET request for unknown route received', async () => {
    const res = await request(app).get('/apis/UNKNOWN_ROUTE/');
    expect(res.body).toHaveProperty('message');
  });

  it('should log the error when POST request for unknown route received', async () => {
    const res = await request(app).post('/apis/UNKNOWN_ROUTE/').send({data: 'UNKNOWN_DATA'});
    expect(res.body).toHaveProperty('message');
  });
});
