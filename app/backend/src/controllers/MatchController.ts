import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchService from '../services/MatchService';
import Token from '../helpers/token';

export default class MatchController {
  constructor(private service: MatchService) { }

  async findAll(req: Request, res: Response) {
    const matches = await this.service.findAll(req.query.inProgress as string);
    res.status(StatusCodes.OK).json(matches);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      new Token().validateToken(req.headers.authorization);
      const newMatch = await this.service.create(req.body);
      res.status(StatusCodes.CREATED).json(newMatch);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async updateStatus(req: Request, res: Response) {
    const changedOk = await this.service.updateStatus(Number(req.params.id));
    res.status(StatusCodes.OK).json(changedOk);
  }

  async updateResult(req: Request, res: Response) {
    const changedOk = await this.service
      .updateResult(Number(req.params.id), req.body.homeTeamGoals, req.body.awayTeamGoals);
    res.status(StatusCodes.OK).json(changedOk);
  }

  async leaderboardHome(_req: Request, res: Response) {
    const leaderboard = await this.service
      .leaderboardHome();
    res.status(StatusCodes.OK).json(leaderboard);
  }

  async leaderboardAway(_req: Request, res: Response) {
    const leaderboard = await this.service
      .leaderboardAway();
    res.status(StatusCodes.OK).json(leaderboard);
  }
}
