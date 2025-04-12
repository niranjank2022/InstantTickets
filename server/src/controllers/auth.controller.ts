import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { TheatreAdminService } from '../services/theatreAdmin.service';
import { MovieAdminService } from '../services/movieAdmin.service';
import { UserService } from '../services/user.service';
import { config } from '../config/config';
import { Roles } from '../config/enum';
import { messages } from '../config/logger';

export const AuthController = {
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      let user;
      if (role === Roles.TheatreAdmin) {
        user = await TheatreAdminService.getTheatreAdminByEmail(email);
      } else if (role === Roles.MovieAdmin) {
        user = await MovieAdminService.getMovieAdminByEmail(email);
      } else {
        user = await UserService.getUserByEmail(email);
      }

      if (!user) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }

      if (!(await user.isValidPassword(password))) {
        res.status(400).json({
          message: 'email or password incorrect',
        });
        return;
      }

      // Create a JWT token and return with the response
      const token = jwt.sign({ userId: user.id, email: email, role: role }, config.JWT_SECRET_KEY!, {
        expiresIn: config.TOKEN_EXPIRATION_DURATION,
      });
      res.cookie('token', token, {
        expires: new Date(Date.now() + config.TOKEN_EXPIRATION_DURATION_MILLISEC),
        httpOnly: true,
      });
      res.status(200).json({
        userId: user.id,
        message: 'sign in successful',
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  signup: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      if (
        (await TheatreAdminService.doesTheatreAdminExists(email)) ||
        (await MovieAdminService.doesMovieAdminExists(email)) ||
        (await UserService.doesUserExists(email))
      ) {
        res.status(409).json({
          message: 'user already exists',
        });
        return;
      }

      let user;
      if (role === Roles.TheatreAdmin) {
        user = await TheatreAdminService.createTheatreAdmin({ email, password });
      } else if (role === Roles.MovieAdmin) {
        user = await MovieAdminService.createMovieAdmin({ email, password });
      } else {
        user = await UserService.createUser({ email, password });
      }

      // Create a JWT token and return with the response
      const token = jwt.sign({ userId: user!.id, email: email, role: role }, config.JWT_SECRET_KEY!, {
        expiresIn: config.TOKEN_EXPIRATION_DURATION,
      });
      res.cookie('token', token, {
        expires: new Date(Date.now() + config.TOKEN_EXPIRATION_DURATION_MILLISEC),
        httpOnly: true,
      });
      res.status(201).json({
        userId: user!.id,
        message: 'sign up success',
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie('token');
      res.status(200).json();
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },
};
