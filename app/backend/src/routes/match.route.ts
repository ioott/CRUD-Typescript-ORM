import { Router, Request, Response, NextFunction } from 'express';
import MatchService from '../services/MatchService';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchService = new MatchService();
const matchController = new MatchController(matchService);

router.get('/matches', (req: Request, res: Response) =>
  matchController.findAll(req, res));
router.post('/matches', (req: Request, res: Response, next: NextFunction) =>
  matchController.create(req, res, next));
router.patch('/matches/:id/finish', (req: Request, res: Response) =>
  matchController.updateStatus(req, res));
router.patch('/matches/:id', (req: Request, res: Response) =>
  matchController.updateResult(req, res));
router.get('/leaderboard/home', (req: Request, res: Response) =>
  matchController.leaderboardHome(req, res));
router.get('/leaderboard/away', (req: Request, res: Response) =>
  matchController.leaderboardAway(req, res));
export default router;
