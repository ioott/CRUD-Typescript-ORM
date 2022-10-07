import TeamModel from '../database/models/TeamModel';
import ITeamService from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  private db = TeamModel;

  async findAll(): Promise<TeamModel[]> {
    const teams = await this.db.findAll();
    return teams;
  }
}
