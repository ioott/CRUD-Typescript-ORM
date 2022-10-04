import * as bcrypt from 'bcryptjs';
import IUserService from '../interfaces/IUserService';
import { LoginValidation } from '../middlewares/Validations';
import User from '../database/models/UserModel';
import LoginDto from '../interfaces/loginDTO';
import createToken from '../helpers/tokenGenerator';

export default class UserService implements IUserService {
  private db = User;

  public async login(user: LoginDto): Promise<Record<string, string>> {
    await LoginValidation.validateAsync(user);

    if (!user.email || !user.password) { throw new Error('All fields must be filled'); }

    const userOk = await this.db.findOne({
      attributes: ['email', 'password'],
      where: { email: user.email },
    });

    if (!userOk) { throw new Error('user not found'); }

    if (!bcrypt.compareSync(user.password, userOk.password)) {
      throw new Error('incorrect password');
    }

    const token = await createToken(userOk);
    return { token };
  }

  // public async create(user: User): Promise<Record<string, string>> {
  //   await UserValidation.validateAsync(user);
  //   await this.db.create({ ...user });
  //   const token = await createToken(user);
  //   return { token };
  // }
}
