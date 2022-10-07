import LoginDTO from './loginDTO';

interface IUserService {
  login(user: LoginDTO): Promise<Record<string, string>>;
  validate(authorization: string | undefined): Promise<Record<string, string>>;
}

export default IUserService;
