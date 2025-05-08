import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';
import { validateRequest } from '../middleware/validate';
import { CreateVenueDto } from '../dto/CreateVenue.dto';

const router = Router();
router.get('/all', VenueController.getVenuesByAdminEmail);
router.post('/', validateRequest(CreateVenueDto), VenueController.createVenue);

export default router;
