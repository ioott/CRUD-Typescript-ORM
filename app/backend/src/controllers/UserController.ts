import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';

export default class UserController {
  constructor(private service: UserService) { }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.service.login(req.body);
      return res.status(StatusCodes.OK).json(token);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // async validate(req: Request, res: Response) {
  //   const role = await this.service.validate(req.params.authorization);
  //   res.status(StatusCodes.OK).json(role);
  // }
}
