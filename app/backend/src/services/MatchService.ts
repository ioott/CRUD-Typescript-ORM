import { StatusCodes } from 'http-status-codes';
import HttpException from '../middlewares/HttpException';
import IMatchService from '../interfaces/IMatchService';
import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';

export default class MatchService implements IMatchService {
  private db = MatchModel;

  async findAll(query: string | undefined): Promise<MatchModel[]> {
    if (!query) {
      const matches = await this.db.findAll({ include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ] });
      return matches;
    }
    const queryNumber = query === 'true';
    const matches = await this.db.findAll({ include: [
      { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
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
    const newMatch = await this.db.create({ ...dataNewMatch });
    return newMatch;
  }

  async update(id: number): Promise<Record<string, string>> {
    await this.db.update(
      { inProgress: false },
      { where: { id } },
    );
    return { message: 'Finished' };
  }
}
