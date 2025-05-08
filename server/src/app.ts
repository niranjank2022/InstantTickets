import cors from 'cors';
import express, { Application } from 'express';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route';
import bookingsRouter from './routes/booking.route';
import showsRouter from './routes/show.route';
import venuesRouter from './routes/venue.route';
import moviesRouter from './routes/movie.route';
import { messages } from './config/logger';

// Create the express app
const app: Application = express();
const allowedOrigins = ['http://localhost:5173', 'https://instanttickets.onrender.com'];

// Add middlewares before routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Mount the API routes
app.use('/apis/auth', authRouter);
app.use('/apis/bookings', bookingsRouter);
app.use('/apis/shows', showsRouter);
app.use('/apis/venues', venuesRouter);
app.use('/apis/movies', moviesRouter);

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ message: messages.ROUTE_NOT_FOUND });
});

export default app;
