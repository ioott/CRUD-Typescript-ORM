import { Router, Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/login/validate', (req: Request, res: Response) => userController.validate(req, res));
router.post('/login', (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next));

export default router;
