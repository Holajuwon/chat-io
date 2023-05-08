import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import AuthValidator from '../validation/auth.validation';
import AuthController from '../controller/auth.controller';

const router = Router();

router.post(
  '/register',
  AuthValidator.validateRegister,
  AuthMiddleware.checkIfUserEmailExist,
  AuthController.signup,
);

router.post(
  '/login',
  AuthValidator.login,
  AuthMiddleware.validateUser,
  AuthMiddleware.comparePassword,
  AuthController.login,
);

export default router;
