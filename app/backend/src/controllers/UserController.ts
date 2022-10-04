import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(private service: UserService) { }

  async login(req: Request, res: Response) {
    const token = await this.service.login(req.body);
    res.status(200).json(token);
  }
}
