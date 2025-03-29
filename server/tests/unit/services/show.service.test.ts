import { HydratedDocument } from 'mongoose';
import { IShow } from '../../../src/models/show.model';
import { ShowRepository } from '../../../src/repositories/show.repository';
import { ShowService } from '../../../src/services/show.service';
import Sample from '../../../seeds/sample';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/repositories/show.repository');

describe('ShowService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get show by ID', async () => {
    const mockShow = Sample.shows[0];
    (ShowRepository.findById as jest.Mock).mockResolvedValue(mockShow);

    const show = await ShowService.getShowById(mockShow._id);
    expect(show).toEqual(mockShow);
  });

  test('should throw error if some error happens', async () => {
    const mockShow = Sample.shows[0];
    (ShowRepository.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(ShowService.getShowById(mockShow._id)).rejects.toThrow(
      messages.show.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should get show by ID', async () => {
    const mockShow = Sample.shows[0];
    (ShowRepository.find as jest.Mock).mockResolvedValue(mockShow);

    const show = await ShowService.getShowsWithExpiredSeats();
    expect(show).toEqual(mockShow);
  });

  test('should throw error if some error happens', async () => {
    (ShowRepository.find as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(ShowService.getShowsWithExpiredSeats()).rejects.toThrow(
      messages.show.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should add multiple shows', async () => {
    const shows = Sample.shows;
    (ShowRepository.insertMany as jest.Mock).mockResolvedValue(shows);

    const result = await ShowService.addMultipleShows(shows as HydratedDocument<IShow>[]);
    expect(result).toEqual(shows);
  });

  test('should throw error if some error happens', async () => {
    const shows = Sample.shows;
    (ShowRepository.insertMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(ShowService.addMultipleShows(shows as HydratedDocument<IShow>[])).rejects.toThrow(
      messages.show.INSERT_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete all shows', async () => {
    (ShowRepository.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await ShowService.deleteAllShows();
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (ShowRepository.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(ShowService.deleteAllShows()).rejects.toThrow(messages.show.DELETE_ERROR + messages.RANDOM_ERROR);
  });
});
