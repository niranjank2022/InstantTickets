import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';

const router = Router();
router.get('/:venueId/', VenueController.getVenueById);

export default router;
