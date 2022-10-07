import { Router, Request, Response } from 'express';
import TeamService from '../services/TeamService';
import TeamController from '../controllers/TeamController';

const router = Router();

const teamService = new TeamService();
const teamController = new TeamController(teamService);

router.get('/team', (req: Request, res: Response) =>
  teamController.findAll(req, res));

export default router;
