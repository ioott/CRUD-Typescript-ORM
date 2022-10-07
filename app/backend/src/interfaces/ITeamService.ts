import TeamModel from '../database/models/TeamModel';

interface ITeamService {
  findAll(): Promise<TeamModel[]>;
  findOne(userId: number): Promise<TeamModel>;
}

export default ITeamService;
