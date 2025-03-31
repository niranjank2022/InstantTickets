import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { signupDto } from '../dto/signup.dto';
import { signinDto } from '../dto/signin.dto';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
router.post('/signup', validateRequest(signupDto), AuthController.signup);
router.post('/signin', validateRequest(signinDto), AuthController.signin);
router.post('/logout', AuthController.logout);

export default router;
