import { HydratedDocument } from 'mongoose';
import { IShow, Show } from '../../../src/models/show.model';
import { ShowRepository } from '../../../src/repositories/show.repository';
import Sample from '../../../seeds/sample';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/models/show.model');

describe('ShowRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should find show by ID', async () => {
    const mockShow = Sample.shows[0];
    (Show.findById as jest.Mock).mockResolvedValue(mockShow);

    const show = await ShowRepository.findById(mockShow._id);
    expect(show).toEqual(mockShow);
  });

  test('should throw error if some error happens', async () => {
    const mockShow = Sample.shows[0];
    (Show.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(ShowRepository.findById(mockShow._id)).rejects.toThrow(
      messages.show.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should find show by some parameters', async () => {
    const mockShow = Sample.shows[0];
    (Show.find as jest.Mock).mockResolvedValue(mockShow);

    const show = await ShowRepository.find('seats.expirationTime', new Date());
    expect(show).toEqual(mockShow);
  });

  test('should throw error if some error happens', async () => {
    (Show.find as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(ShowRepository.find('seats.expirationTime', new Date())).rejects.toThrow(
      messages.show.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should insert multiple shows', async () => {
    const shows = Sample.shows;
    (Show.insertMany as jest.Mock).mockResolvedValue(shows);

    const result = await ShowRepository.insertMany(shows as HydratedDocument<IShow>[]);
    expect(result).toEqual(shows);
  });

  test('should throw error if some error happens', async () => {
    const shows = Sample.shows;
    (Show.insertMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(ShowRepository.insertMany(shows as HydratedDocument<IShow>[])).rejects.toThrow(
      messages.show.INSERT_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete shows based on filter', async () => {
    (Show.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await ShowRepository.deleteMany({});
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (Show.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(ShowRepository.deleteMany({})).rejects.toThrow(messages.show.DELETE_ERROR + messages.RANDOM_ERROR);
  });
});
