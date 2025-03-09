import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validate';
import { createBookingDto } from '../dto/createBooking.dto';

const router = Router();
router.post('/', validateRequest(createBookingDto), createBooking);

export default router;
