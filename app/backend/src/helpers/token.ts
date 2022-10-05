import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) { throw new Error(); }

const createToken = (user: Record<string, string>): string => {
  const token = jwt.sign({ ...user }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '10d' });
  return token;
};

const validateToken = (token: string):void => {
  const payload = jwt.verify(token, JWT_SECRET);
  console.log(payload);
};

export { createToken, validateToken };
