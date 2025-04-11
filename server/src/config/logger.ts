import { config } from './config';

export const messages = Object.freeze({
  UNKNOWN_ERROR: 'Unknown error occurred.',

  MONGODB_CONNECTION_SUCCESS: 'Connected to MongoDB successfully',
  MONGODB_CONNECTION_FAILURE: 'Error: MongoDB connection failure',
  SERVER_RUNNING: `Server is running on port ${config.PORT}`,
  ROUTE_NOT_FOUND: "Error: Sorry, that route doesn't exist.",
  
  
  RECORD_NOT_FOUND: 'Error: No records were found.',
  SERVER_ERROR: 'Error: Some error happened while processing the request.',
  CLEARED_RECORDS: (model: string) => `Cleared existing ${model} records.`,
  SEEDS_RUNNING: 'Running all seed scripts.',
  SEEDS_COMPLETED: 'All seeds completed.',
  SEED_SUCCESS: (model: string) => `${model} seeded successfully.`,
  SEAT_ALREADY_RESERVED: 'Seat was already reserved.',
  SEAT_ALREADY_FREED: 'Seat was already made available.',
  SEAT_RESERVED_NOW: 'Seat has been reserved.',
  SEAT_BOOKED_NOW: 'Seat has been booked.',
  SEAT_NOT_FOUND: 'Seat not found.',
  SEAT_CANNOT_BOOK: "Error: Can't book this seat.",
  SEAT_CLEANUP_ERROR: "Error: Can't cleanup the seats (node-cron).",
  CLIENT_CONNECTED: (sockedId: string) => `New socket client connected: ${sockedId}`,
  CLIENT_DISCONNECTED: (sockedId: string) => `New socket client disconnected: ${sockedId}`,
  SOCKET_INIT_ERROR: 'Error: Socket.io is not initialized.',
  SEAT_CLEANUP_STARTED: 'Seats are being checked for timeout of reservation expiry time...',
  VALIDATION_ERROR: 'Validation failed',

  RANDOM_ERROR: 'Some error',

  venue: {
    FIND_ERROR: 'Error finding venue: ',
    INSERT_ERROR: 'Error inserting venues: ',
    DELETE_ERROR: 'Error deleting venues: ',
  },
  show: {
    FIND_ERROR: 'Error finding show: ',
    INSERT_ERROR: 'Error inserting show: ',
    DELETE_ERROR: 'Error deleting shows: ',
  },
  movie: {
    FIND_ERROR: 'Error finding movie: ',
    INSERT_ERROR: 'Error inserting movie: ',
    DELETE_ERROR: 'Error deleting movies: ',
  },
  booking: {
    FIND_ERROR: 'Error finding booking: ',
    CREATE_ERROR: 'Error creating booking: ',
    DELETE_ERROR: 'Error deleting booking: ',
  },
});

export function logError(error: Error) {
  console.error('Error message: ', error.message);
  console.error('Error Stack Trace: ', error.stack);
}
