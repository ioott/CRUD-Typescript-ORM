import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../middlewares/HttpException';

dotenv.config();

const { JWT_SECRET } = process.env;

const jwtDefaultConfig: jwt.SignOptions = {
  expiresIn: '15d',
  algorithm: 'HS256',
};

class Token {
  constructor(private jwtConfig?: jwt.SignOptions) {
    if (!jwtConfig) {
      this.jwtConfig = jwtDefaultConfig;
    }
  }

  public createToken(payload: Record<string, string>) {
    if (!JWT_SECRET) {
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT_SECRET doesn`t exist');
    }
    return jwt.sign(payload, JWT_SECRET, this.jwtConfig);
  }

  public validateToken(token: string | undefined) {
    if (!JWT_SECRET) {
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'JWT_SECRET doesn`t exist');
    }
    if (!token) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'invalid token');
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET, this.jwtConfig);
      return Object.values(payload)[0];
    } catch (e) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Token must be a valid token');
    }
  }
}

export default Token;
