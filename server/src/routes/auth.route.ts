import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { SignupDto } from '../dto/Signup.dto';
import { SigninDto } from '../dto/Signin.dto';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
router.post('/signup', validateRequest(SignupDto), AuthController.signup);
router.post('/signin', validateRequest(SigninDto), AuthController.signin);
router.post('/logout', AuthController.logout);

export default router;
