import { Router } from 'express';
import { ShowController } from '../controllers/show.controller';

const router = Router();
router.get('/:showId/', ShowController.getShowById);

export default router;
