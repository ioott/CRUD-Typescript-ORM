import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private service: MatchService) { }

  async findAll(req: Request, res: Response) {
    const matches = await this.service.findAll(req.query.inProgress as string);
    res.status(StatusCodes.OK).json(matches);
  }

  async create(req: Request, res: Response) {
    const newMatch = await this.service.create(req.body);
    res.status(StatusCodes.CREATED).json(newMatch);
  }
}
