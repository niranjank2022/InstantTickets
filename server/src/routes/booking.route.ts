import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validate';
import { CreateBookingDto } from '../dto/CreateBooking.dto';

const router = Router();
router.post('/', validateRequest(CreateBookingDto), BookingController.createBooking);

export default router;
