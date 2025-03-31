import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { AdminService } from '../services/admin.service';

export const AuthController = {
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const admin = await AdminService.getAdminByEmail(email);
      if (!admin) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      if (!(await admin.isValidPassword(password))) {
        res.status(400).json({
          message: 'email or password incorrect',
        });
        return;
      }

      // Create a JWT token and return with the response
      const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET_KEY!, {
        expiresIn: config.TOKEN_EXPIRATION_DURATION,
      });
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });
      res.status(201).json({
        message: 'sign in successful',
      });
    } catch (error) {
      res.status(500).json({
        message: 'error occurred',
        error,
      });
    }
  },

  signup: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Checking if admin exists
      const adminExists = await AdminService.doesAdminExists(email);
      if (adminExists) {
        res.status(400).json({
          message: 'user already exists',
        });
        return;
      }
      const admin = await AdminService.createAdmin({ email, password });

      // Create a JWT token and return with the response
      const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET_KEY!, {
        expiresIn: config.TOKEN_EXPIRATION_DURATION,
      });
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });
      res.status(200).json({
        message: 'sign up success',
      });
    } catch (err) {
      res.status(500).json({
        message: 'error occurred',
      });
    }
  },
};
