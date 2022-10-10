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

describe('testa a rota get /matches', () =>
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

describe('testa a rota post /matches', () =>
{
  let chaiHttpResponse: Response;
  const matchesMock: MatchDTO = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
  };

  before(() =>
  {
    sinon.stub(MatchModel, 'create')
      .resolves({ ...matchesMock } as MatchModel);
  });
  after(() => {
    sinon.restore();
  })

  it('Verifica se é possível cadastrar nova partida em andamento, retorna os dados da partida e um status 201', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        'id': 1,
        'homeTeam': 16,
        'awayTeam': 2,
        'homeTeamGoals': 8,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.CREATED);
    expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
  });

  it('Verifica que não é possível cadastrar uma partida com times iguais. Caso haja uma tentativa, retorna um status 401', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send({
        'id': 1,
        'homeTeam': 16,
        'awayTeam': 16,
        'homeTeamGoals': 8,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.UNAUTHORIZED);
    expect(chaiHttpResponse.body).to.equal({
      message: 'It is not possible to create a match with two equal teams'
    });
  });
});
