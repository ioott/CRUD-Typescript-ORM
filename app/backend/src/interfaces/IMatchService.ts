import MatchModel from '../database/models/MatchModel';

interface IMatchService {
  findAll(): Promise<MatchModel[]>;
  // findOne(userId: number): Promise<MatchModel>;
}

export default IMatchService;
