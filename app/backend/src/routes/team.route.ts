import { Router, Request, Response } from 'express';
import TeamService from '../services/TeamService';
import TeamController from '../controllers/TeamController';

const router = Router();

const teamService = new TeamService();
const teamController = new TeamController(teamService);

router.get('/teams/:id', (req: Request, res: Response) => teamController.findOne(req, res));
router.get('/teams', (req: Request, res: Response) => teamController.findAll(req, res));

export default router;
