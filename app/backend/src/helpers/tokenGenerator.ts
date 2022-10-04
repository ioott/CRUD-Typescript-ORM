import * as jwt from 'jsonwebtoken';
import LoginDto from '../interfaces/loginDTO';

const JWT_SECRET = 'minhasenhasupersecreta';

const createToken = (user: LoginDto): string => {
  const token = jwt.sign({ ...user }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '10d' });
  return token;
};

export default createToken;
