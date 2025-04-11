import cors from 'cors';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route';
import bookingsRouter from './routes/booking.route';
import showsRouter from './routes/show.route';
import venuesRouter from './routes/venue.route';
import moviesRouter from './routes/movie.route';
import { startSeatCleanupJob } from './socket/seatCleanup.job';
import { messages } from './config/logger';

// Create the express app
const app: Application = express();

// Add middlewares before routes
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Mount the API routes
app.use('/apis/auth/', authRouter);
app.use('/apis/bookings/', bookingsRouter);
app.use('/apis/shows/', showsRouter);
app.use('/apis/venues/', venuesRouter);
app.use('/apis/movies/', moviesRouter);

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ message: messages.ROUTE_NOT_FOUND });
});

startSeatCleanupJob();

export default app;
