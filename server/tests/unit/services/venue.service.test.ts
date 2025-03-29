import { HydratedDocument } from 'mongoose';
import { IVenue } from '../../../src/models/venue.model';
import { VenueRepository } from '../../../src/repositories/venue.repository';
import { VenueService } from '../../../src/services/venue.service';
import Sample from '../../../seeds/sample';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/repositories/venue.repository');

describe('VenueService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get venue by ID', async () => {
    const mockVenue = Sample.venues[0];
    (VenueRepository.findById as jest.Mock).mockResolvedValue(mockVenue);

    const venue = await VenueService.getVenueById(mockVenue._id);
    expect(venue).toEqual(mockVenue);
  });

  test('should throw error if some error happens', async () => {
    const mockVenue = Sample.venues[0];
    (VenueRepository.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(VenueService.getVenueById(mockVenue._id)).rejects.toThrow(
      messages.venue.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should add multiple venues', async () => {
    const venues = Sample.venues;
    (VenueRepository.insertMany as jest.Mock).mockResolvedValue(venues);

    const result = await VenueService.addMultipleVenues(venues as HydratedDocument<IVenue>[]);
    expect(result).toEqual(venues);
  });

  test('should throw error if some error happens', async () => {
    const venues = Sample.venues;
    (VenueRepository.insertMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(VenueService.addMultipleVenues(venues as HydratedDocument<IVenue>[])).rejects.toThrow(
      messages.venue.INSERT_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete all venues', async () => {
    (VenueRepository.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await VenueService.deleteAllVenues();
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (VenueRepository.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(VenueService.deleteAllVenues()).rejects.toThrow(messages.venue.DELETE_ERROR + messages.RANDOM_ERROR);
  });
});
