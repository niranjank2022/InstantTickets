import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middleware/validate';
import { CreateBookingDto } from '../dto/CreateBooking.dto';

const router = Router();
router.post('/', validateRequest(CreateBookingDto), BookingController.createBooking);
router.get('/all', BookingController.getAllTicketsByEmail);
router.get('/:bookingId', BookingController.getTicketByBookingId);

export default router;
