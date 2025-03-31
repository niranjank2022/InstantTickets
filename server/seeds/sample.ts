import { SeatStatus } from '../src/config/enum';
import { ISeat } from '../src/models/show.model';

const sections = [
  [
    { x: 0, y: 0, rows: 5, columns: 10 },
    { x: 5, y: 0, rows: 5, columns: 10 },
    { x: 10, y: 0, rows: 10, columns: 10 },
  ],
  [
    { x: 0, y: 0, rows: 5, columns: 15 },
    { x: 5, y: 0, rows: 10, columns: 15 },
    { x: 15, y: 0, rows: 10, columns: 10 },
  ],
];

const sample = {
  admins: [
    {
      email: 'admin@gmail.com',
      password: 'adminpassword',
    },
  ],
  venues: [
    {
      _id: 'venueId123',
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
      _id: 'venueId456',
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
  ],
  shows: [
    {
      _id: 'show123',
      venueId: 'venue123',
      name: 'Avengers: Endgame',
      startTime: new Date('2024-03-01T18:00:00.000Z'),
      endTime: new Date('2024-03-01T21:00:00.000Z'),
      seats: generateSeats(sections[0]),
    },
    {
      _id: 'show456',
      venueId: 'venue456',
      name: 'Batman Begins',
      startTime: new Date('2024-03-02T20:00:00.000Z'),
      endTime: new Date('2024-03-02T23:00:00.000Z'),
      seats: generateSeats(sections[1]),
    },
  ],
  bookings: {
    find: {
      _id: 'booking123',
      userId: 'user123',
      venueId: 'venue123',
      showId: 'showId',
      bookingTime: new Date(),
      bookedSeats: ['seat123', 'seat456'],
    },
    create: {
      userId: 'user456',
      venueId: 'venue456',
      showId: 'showId',
      bookingTime: new Date(),
      bookedSeats: ['seat123', 'seat456'],
    },
  },
};

function generateSeats(sections: { x: number; y: number; rows: number; columns: number }[]) {
  const seats: ISeat[] = [];
  for (const { x, y, rows, columns } of sections) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        seats.push({
          x: x + i,
          y: y + j,
          status: SeatStatus.Available,
          expirationTime: null,
        });
      }
    }
  }

  return seats;
}

export default sample;
