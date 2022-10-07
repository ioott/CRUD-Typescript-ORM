import { StatusCodes } from 'http-status-codes';
import TeamModel from '../database/models/TeamModel';
import ITeamService from '../interfaces/ITeamService';
import HttpException from '../middlewares/HttpException';

export default class TeamService implements ITeamService {
  private db = TeamModel;

  async findAll(): Promise<TeamModel[]> {
    const teams = await this.db.findAll();
    return teams;
  }

  async findOne(userId: number): Promise<TeamModel> {
    const team = await this.db.findOne({
      attributes: ['id', 'teamName'],
      where: { id: userId },
    });
    if (!team) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }
    return team;
  }
}
