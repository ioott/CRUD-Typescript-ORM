import { StatusCodes } from 'http-status-codes';
import HttpException from '../middlewares/HttpException';
import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import calcHomeTeam from '../utils/leaderboardHome';
import calcAwayTeam from '../utils/leaderboardAway';

export default class MatchService implements IMatchService {
  private dbMatch = MatchModel;
  private dbTeam = TeamModel;

  async findAll(query: string | undefined): Promise<MatchModel[]> {
    if (!query) {
      const matches = await this.dbMatch.findAll({ include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ] });
      return matches;
    }
    const queryNumber = query === 'true';
    const matches = await this.dbMatch.findAll({ include: [
      { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
    ],
    where: { inProgress: queryNumber },
    });
    return matches;
  }

  async create(dataNewMatch: MatchModel): Promise<MatchModel> {
    if (dataNewMatch.awayTeam === dataNewMatch.homeTeam) {
      throw new HttpException(StatusCodes
        .UNAUTHORIZED, 'It is not possible to create a match with two equal teams');
    }
    const verifyAwayTeam = await this.dbMatch.findOne({
      attributes: ['id'], where: { id: dataNewMatch.awayTeam },
    });
    const verifyHomeTeam = await this.dbMatch.findOne({
      attributes: ['id'], where: { id: dataNewMatch.homeTeam },
    });
    if (!verifyAwayTeam || !verifyHomeTeam) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'There is no team with such id!');
    }
    const newMatch = await this.dbMatch.create({ ...dataNewMatch });
    return newMatch;
  }

  async updateStatus(id: number): Promise<Record<string, string>> {
    await this.dbMatch.update(
      { inProgress: false },
      { where: { id } },
    );
    return { message: 'Finished' };
  }

  async updateResult(id: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<Record<string, string>> {
    await this.dbMatch.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
    return { message: 'Result updated' };
  }

  async leaderboardHome() {
    const dataHomeTeams = await this.dbTeam.findAll({
      attributes: { exclude: ['id'] },
      include:
        [
          {
            model: MatchModel,
            as: 'teamHome',
            where: { inProgress: false },
            attributes: ['homeTeamGoals', 'awayTeamGoals'],
          },
        ],
    });

    const leaderboard = calcHomeTeam(dataHomeTeams);
    return leaderboard;
  }

  async leaderboardAway() {
    const dataAwayTeams = await this.dbTeam.findAll({
      attributes: { exclude: ['id'] },
      include:
        [
          {
            model: MatchModel,
            as: 'teamAway',
            where: { inProgress: false },
            attributes: ['homeTeamGoals', 'awayTeamGoals'],
          },
        ],
    });

    const leaderboard = calcAwayTeam(dataAwayTeams);
    return leaderboard;
  }

  async leaderboard() {
    const dataHomeTeams = await this.dbTeam.findAll({
      attributes: { exclude: ['id'] },
      include: [{ model: MatchModel,
        as: 'teamHome',
        where: { inProgress: false },
        attributes: ['homeTeamGoals', 'awayTeamGoals'] }],
    });

    const dataAwayTeams = await this.dbTeam.findAll({
      attributes: { exclude: ['id'] },
      include: [{ model: MatchModel,
        as: 'teamAway',
        where: { inProgress: false },
        attributes: ['homeTeamGoals', 'awayTeamGoals'] }],
    });

    const leaderboardAway = calcAwayTeam(dataAwayTeams);
    const leaderboardHome = calcHomeTeam(dataHomeTeams);
    return leaderboardHome.concat(leaderboardAway);
  }
}
