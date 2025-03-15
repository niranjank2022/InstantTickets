import 'dotenv/config';
import { Venue } from '../models/venue.model';
import { logError, messages } from '../config/logger';

const venues = [
  {
    name: 'Royal Theatre',
    location: '123 Main St',
    rows: 20,
    columns: 30,
    rowIndices: [...Array(20).keys()].map(i => String.fromCharCode(65 + i)), // A - T
    columnIndices: [...Array(30).keys()].map(i => (i + 1).toString()), // 1 - 30
    sections: [
      { name: 'VIP', x: 0, y: 0, rows: 5, columns: 10, price: 100 },
      { name: 'Premium', x: 5, y: 0, rows: 5, columns: 10, price: 75 },
      { name: 'Regular', x: 10, y: 0, rows: 10, columns: 10, price: 50 },
    ],
  },
  {
    name: 'Grand Arena',
    location: '456 Broadway',
    rows: 25,
    columns: 40,
    rowIndices: [...Array(25).keys()].map(i => String.fromCharCode(65 + i)), // A - Y
    columnIndices: [...Array(40).keys()].map(i => (i + 1).toString()), // 1 - 40
    sections: [
      { name: 'Balcony', x: 0, y: 0, rows: 5, columns: 15, price: 120 },
      { name: 'Standard', x: 5, y: 0, rows: 10, columns: 15, price: 80 },
      { name: 'Economy', x: 15, y: 0, rows: 10, columns: 10, price: 40 },
    ],
  },
];

export async function seedVenues() {
  try {
    await Venue.deleteMany({});
    console.log(messages.CLEARED_RECORDS('Venues'));

    await Venue.insertMany(venues);
    console.log(messages.SEED_SUCCESS('Venues'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
