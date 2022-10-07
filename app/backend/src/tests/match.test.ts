import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';
import MatchDTO from '../interfaces/matchDTO';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota /matches', () =>
{
  let chaiHttpResponse: Response;
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
  });
  after(() => {
    sinon.restore();
  })

  it('Retorna todos os jogos e um status 200', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');
    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
  });
});

