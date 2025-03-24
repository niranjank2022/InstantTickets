import request from 'supertest';
import app from './../../../src/app';
import Sample from '../../../src/seeds/sample';
import { ShowService } from '../../../src/services/show.service';

jest.mock('../../../src/services/show.service');

describe('Shows API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns status code 200 if show found', async () => {
    const mockShow = Sample.shows[0];
    (ShowService.getShowById as jest.Mock).mockResolvedValue(mockShow);
    const res = await request(app).get(`/apis/shows/${mockShow._id}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 if show is not found', async () => {
    (ShowService.getShowById as jest.Mock).mockResolvedValue(undefined);
    const mockShowId = Sample.shows[0]._id;
    const response = await request(app).get(`/apis/shows/${mockShowId}`);
    expect(response.status).toBe(404);
  });

  it('should return 500 if server error occurs', async () => {
    const mockShowId = Sample.shows[0]._id;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    let res;

    (ShowService.getShowById as jest.Mock).mockRejectedValue(new Error('Server Error'));
    res = await request(app).get(`/apis/shows/${mockShowId}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    (ShowService.getShowById as jest.Mock).mockRejectedValue({ message: 'Error occurred' });
    res = await request(app).get(`/apis/shows/${mockShowId}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
