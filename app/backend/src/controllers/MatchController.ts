import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private service: MatchService) { }

  async findAll(_req: Request, res: Response) {
    const matches = await this.service.findAll();
    res.status(StatusCodes.OK).json(matches);
  }
}
