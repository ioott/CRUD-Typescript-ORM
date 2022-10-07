import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(private service: TeamService) { }

  async findAll(_req: Request, res: Response) {
    const teams = await this.service.findAll();
    res.status(StatusCodes.OK).json(teams);
  }

  async findOne(req: Request, res: Response) {
    const team = await this.service.findOne(Number(req.params.id));
    res.status(StatusCodes.OK).json(team);
  }
}
