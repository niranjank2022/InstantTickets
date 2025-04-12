import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { MovieAdminService } from '../services/movieAdmin.service';
import { config } from '../config/config';
import { messages } from '../config/logger';

interface ICustomJwtPayload extends JwtPayload {
  adminId: string;
  email: string;
}

export const MovieController = {
  createMovie: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: 'Token is not found. Access denied' });
        return;
      }

      const { email } = jwt.verify(token, config.JWT_SECRET_KEY!) as ICustomJwtPayload;
      const { title, img, languages, formats, genres, cities } = req.body;
      const movie = await MovieService.createMovie({
        title: title,
        img: img,
        languages: languages,
        formats: formats,
        genres: genres,
        cities: cities,
      });

      await MovieAdminService.addMovieId(email, movie.id);
      res.status(201).json({ movieId: movie.id, message: 'movie added successfully' });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: 'Token expired. Please login again.' });
        return;
      }
      if (error instanceof JsonWebTokenError) {
        res.status(403).json({ message: 'Invalid token.' });
        return;
      }
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getMoviesByAdminEmail: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: 'unauthorized access denied!' });
        return;
      }

      const { email } = jwt.verify(token, config.JWT_SECRET_KEY!) as ICustomJwtPayload;
      const movies = await MovieService.getMoviesByAdminEmail(email);
      res.status(200).json({
        movies: movies,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: 'Token expired. Please login again.' });
        return;
      }
      if (error instanceof JsonWebTokenError) {
        res.status(403).json({ message: 'Invalid token.' });
        return;
      }
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getMoviesByCity: async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      const movies = await MovieService.getMoviesByCity(city);
      res.status(200).json({
        movies: movies,
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  updateMovie: async (req: Request, res: Response) => {
    try {
      const { movieId } = req.params;
      const { title, img, languages, formats, genres, cities } = req.body;
      await MovieService.updateMovieById(movieId, {
        title: title,
        img: img,
        languages: languages,
        formats: formats,
        genres: genres,
        cities: cities,
      });
      res.status(200).json({ message: 'movie updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },
};
