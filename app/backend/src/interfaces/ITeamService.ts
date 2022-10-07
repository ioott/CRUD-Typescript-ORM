import TeamModel from '../database/models/TeamModel';

interface ITeamService {
  findAll(): Promise<TeamModel[]>;
}

export default ITeamService;
