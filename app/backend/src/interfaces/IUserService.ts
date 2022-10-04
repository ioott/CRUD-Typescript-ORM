import LoginDTO from './loginDTO';

interface IUserService {
  login(user: LoginDTO): Promise<Record<string, string>>
}

export default IUserService;
