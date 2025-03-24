import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validate';
import { createBookingDto } from '../dto/createBooking.dto';

const router = Router();
router.post('/', validateRequest(createBookingDto), BookingController.createBooking);

export default router;
