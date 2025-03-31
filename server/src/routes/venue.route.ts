import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';

const router = Router();
router.get('/all/', VenueController.getVenuesByAdminEmail);

export default router;
