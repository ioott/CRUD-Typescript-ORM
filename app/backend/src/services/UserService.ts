import * as bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import IUserService from '../interfaces/IUserService';
import User from '../database/models/UserModel';
import LoginDto from '../interfaces/loginDTO';
import Token from '../helpers/token';
import HttpException from '../middlewares/HttpException';

export default class UserService implements IUserService {
  private db = User;

  public async login(user: LoginDto): Promise<Record<string, string>> {
    if (!user.email || !user.password) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'All fields must be filled');
    }

    const userOk = await this.db.findOne({
      attributes: ['email', 'password'],
      where: { email: user.email },
    });

    if (!userOk) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!bcrypt.compareSync(user.password, userOk.password)) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    const payload = userOk.email;
    const tokenHelper = new Token();
    const token = tokenHelper.createToken({ payload });
    return { token };
  }

  public async validate(authorization: string | undefined):
  Promise<Record<string, string>> {
    const tokenHelper = new Token();
    const payload = tokenHelper.validateToken(authorization);

    const user = await this.db.findOne({
      attributes: ['role'],
      where: { email: payload },
    });
    if (!user) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'user not found');
    }

    return { role: user.role };
  }

  // public async create(user: User): Promise<Record<string, string>> {
  //   await UserValidation.validateAsync(user);
  //   await this.db.create({ ...user });
  //   const token = await createToken(user);
  //   return { token };
  // }
}
