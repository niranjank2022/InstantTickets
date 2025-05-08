import { Router } from 'express';
import { ShowController } from '../controllers/show.controller';
import { validateRequest } from '../middleware/validate';
import { CreateShowDto } from '../dto/CreateShow.dto';

const router = Router();
router.get('/:showId', ShowController.getShowById);
router.get('/:showId/seat-map', ShowController.getSeatMap);
router.get('/venue/:venueId', ShowController.getShowsByVenueId);
router.get('/movie/:movieId/:city', ShowController.getShowsByMovieIdCity);
router.post('/', validateRequest(CreateShowDto), ShowController.createShow);

export default router;
