import { Router, Request, Response } from 'express';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post('/login', (req: Request, res: Response) => userController.login(req, res));

export default router;
