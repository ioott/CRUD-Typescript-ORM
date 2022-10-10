import MatchModel from '../database/models/MatchModel';

interface IMatchService {
  findAll(query: string): Promise<MatchModel[]>;
}

export default IMatchService;
