import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { VenueService } from '../services/venue.service';
import { TheatreAdminService } from '../services/theatreAdmin.service';
import { config } from '../config/config';
import { messages } from '../config/logger';

interface ICustomJwtPayload extends JwtPayload {
  adminId: string;
  email: string;
}

export const VenueController = {
  createVenue: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: 'unauthorized access denied!' });
        return;
      }

      const { email } = jwt.verify(token, config.JWT_SECRET_KEY!) as ICustomJwtPayload;
      const { name, city, rows, columns, sections } = req.body;
      const venueExists = await VenueService.checkVenueExists(name, city);
      if (venueExists) {
        res.status(409).json({ message: 'venue of same name and city already exists' });
        return;
      }

      const venue = await VenueService.createVenue({
        name: name,
        city: city,
        rows: rows,
        columns: columns,
        sections: sections,
      });

      await TheatreAdminService.addVenueId(email, venue.id);
      res.status(201).json({ venueId: venue.id, message: 'venue added successfully' });
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

  getVenueById: async (req: Request, res: Response) => {
    try {
      const venueId = req.params.venueId.trim();
      const venue = await VenueService.getVenueById(venueId);

      if (!venue) {
        res.status(404).json({
          message: messages.RECORD_NOT_FOUND,
        });
        return;
      }

      res.status(200).json({
        venueId: venue!._id,
        name: venue!.name,
        city: venue!.city,
        rows: venue!.rows,
        columns: venue!.columns,
        sections: venue!.sections,
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getVenuesByAdminEmail: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: 'unauthorized access denied!' });
        return;
      }
      const { email } = jwt.verify(token, config.JWT_SECRET_KEY!) as ICustomJwtPayload;
      const venues = await VenueService.getVenuesByAdminEmail(email);
      res.status(200).json({
        venues: venues,
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
};
