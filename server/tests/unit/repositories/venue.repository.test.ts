import { HydratedDocument } from 'mongoose';
import { IVenue, Venue } from '../../../src/models/venue.model';
import { VenueRepository } from '../../../src/repositories/venue.repository';
import Sample from '../../../src/seeds/sample';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/models/venue.model');

describe('VenueRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should find venue by ID', async () => {
    const mockVenue = Sample.venues[0];
    (Venue.findById as jest.Mock).mockResolvedValue(mockVenue);

    const venue = await VenueRepository.findById(mockVenue._id);
    expect(venue).toEqual(mockVenue);
  });

  test('should throw error if some error happens', async () => {
    const mockVenue = Sample.venues[0];
    (Venue.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(VenueRepository.findById(mockVenue._id)).rejects.toThrow(
      messages.venue.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should insert multiple venues', async () => {
    const venues = Sample.venues;
    (Venue.insertMany as jest.Mock).mockResolvedValue(venues);

    const result = await VenueRepository.insertMany(venues as HydratedDocument<IVenue>[]);
    expect(result).toEqual(venues);
  });

  test('should throw error if some error happens', async () => {
    const venues = Sample.venues;
    (Venue.insertMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(VenueRepository.insertMany(venues as HydratedDocument<IVenue>[])).rejects.toThrow(
      messages.venue.INSERT_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete venues based on filter', async () => {
    (Venue.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await VenueRepository.deleteMany({});
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (Venue.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(VenueRepository.deleteMany({})).rejects.toThrow(messages.venue.DELETE_ERROR + messages.RANDOM_ERROR);
  });
});
