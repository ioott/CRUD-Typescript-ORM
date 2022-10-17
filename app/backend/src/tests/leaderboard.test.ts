import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';
import MatchDTO from '../interfaces/matchDTO';
import TeamDTO from '../interfaces/teamDTO';
import LoginDto from '../interfaces/loginDTO';
import UserModel from '../database/models/UserModel';
import * as jwt from 'jsonwebtoken';
import Ileaderboard from '../interfaces/Ileaderboard';
import TeamModel from '../database/models/TeamModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota get /leaderboard/home', () =>
{
  let chaiHttpResponse: Response;
  const leaderboardMock: Ileaderboard[] = [{
    "name": "Santos",
    "totalPoints": 9,
    "totalGames": 3,
    "totalVictories": 3,
    "totalDraws": 0,
    "totalLosses": 0,
    "goalsFavor": 9,
    "goalsOwn": 3,
    "goalsBalance": 6,
    "efficiency": 100.00,
  }, {
    "name": "Palmeiras",
    "totalPoints": 7,
    "totalGames": 3,
    "totalVictories": 2,
    "totalDraws": 1,
    "totalLosses": 0,
    "goalsFavor": 10,
    "goalsOwn": 5,
    "goalsBalance": 5,
    "efficiency": 77.78,
  }];

  const teamsMock: TeamDTO[] = [{ id: 1, teamName: 'Avaí/Kindermann' }];

  const matchesMock: MatchDTO[] = [{
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    }];

  before(() => {
    sinon.stub(MatchModel, 'findAll')
      .resolves([...matchesMock] as MatchModel[]);

    sinon.stub(TeamModel, 'findAll')
      .resolves([...teamsMock] as TeamModel[]);
  });
  after(() => {
    sinon.restore();
  })

  it('Retorna todos os campos e valores corretos, apenas das partidas finalizadas', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/home');
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardMock);
  });
});
