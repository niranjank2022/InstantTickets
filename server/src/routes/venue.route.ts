import { Router } from 'express';
import { getVenueById } from '../controllers/venue.controller';

const router = Router();
router.get('/:venueId/', getVenueById);

export default router;
