import mongoose from 'mongoose';
import request from 'supertest';
import app from './../../../src/app';
import { VenueService } from '../../../src/services/venue.service';
import Sample from '../../../seeds/sample';

jest.mock('../../../src/services/venue.service');

describe('Venues API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('return status code 200 if venue found', async () => {
    const mockVenue = Sample.venues[0];
    (VenueService.getVenueById as jest.Mock).mockResolvedValue(mockVenue);

    const res = await request(app).get('/apis/venues/' + mockVenue._id);
    expect(res.statusCode).toBe(200);
  });

  it('return status code 404 if venue not found', async () => {
    (VenueService.getVenueById as jest.Mock).mockResolvedValue(undefined);
    const fakeId = new mongoose.Types.ObjectId().toString();

    const response = await request(app).get(`/apis/venues/${fakeId}`);
    expect(response.status).toBe(404);
  });

  it('should return 500 if server error occurs', async () => {
    const mockVenue = Sample.venues[0];
    let res;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (VenueService.getVenueById as jest.Mock).mockRejectedValue(new Error('DB Error'));
    res = await request(app).get(`/apis/venues/${mockVenue._id}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    (VenueService.getVenueById as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    res = await request(app).get(`/apis/venues/${mockVenue._id}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
