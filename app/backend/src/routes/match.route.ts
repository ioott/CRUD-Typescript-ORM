import { Router, Request, Response } from 'express';
import MatchService from '../services/MatchService';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchService = new MatchService();
const matchController = new MatchController(matchService);

router.get('/matches', (req: Request, res: Response) => matchController.findAll(req, res));

export default router;
