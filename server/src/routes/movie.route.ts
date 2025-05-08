import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { validateRequest } from '../middleware/validate';
import { CreateMovieDto } from '../dto/CreateMovie.dto';
import { UpdateMovieDto } from '../dto/UpdateMovie.dto';

const router = Router();
router.get('/all', MovieController.getMoviesByAdminEmail);
router.get('/city/:city', MovieController.getMoviesByCity);
router.post('/', validateRequest(CreateMovieDto), MovieController.createMovie);
router.put('/:movieId', validateRequest(UpdateMovieDto), MovieController.updateMovie);

export default router;
