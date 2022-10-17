import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { Response } from 'superagent';
import MatchDTO from '../interfaces/matchDTO';
import LoginDto from '../interfaces/loginDTO';
import * as jwt from 'jsonwebtoken';

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
  const userMock: LoginDto = {
    'email': 'admin@admin.com',
    'password': 'secret_admin',
  };
  const matchesMock: MatchDTO = {
    id: 1,
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    inProgress: true,
  };

  beforeEach( async() =>
  {
    sinon.stub(jwt, 'verify')
      .returns({ email:'admin@admin.com' } as any);

    sinon.stub(MatchModel, 'create')
      .resolves({ ...matchesMock } as MatchModel);

  });
  afterEach(() =>
  {
    sinon.restore();
  })

  it('Verifica se é possível cadastrar nova partida em andamento, retorna os dados da partida e um status 201', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', 'token')
      .send({
        'homeTeam': 16,
        'awayTeam': 8,
        'homeTeamGoals': 2,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.CREATED);
    expect(chaiHttpResponse.body).to.deep.equal({ ...matchesMock });
  });

  it('Verifica que não é possível cadastrar uma partida com times iguais. Caso haja uma tentativa, retorna um status 401', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', 'token')
      .send({
        'homeTeam': 16,
        'awayTeam': 16,
        'homeTeamGoals': 8,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.UNAUTHORIZED);
    expect(chaiHttpResponse.body).to.deep.equal({
      message: 'It is not possible to create a match with two equal teams'
    });
  });

  it('Verifica que não é possível cadastrar uma partida com um time que não existe na tabela teams. Caso haja uma tentativa, retorna um status 404', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', 'token')
      .send({
        'homeTeam': 210,
        'awayTeam': 16,
        'homeTeamGoals': 8,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.NOT_FOUND);
    expect(chaiHttpResponse.body).to.deep.equal({
      message: 'There is no team with such id!'
    });
  });

  it('Verifica que não é possível inserir uma partida sem um token válido', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', '')
      .send({
        'homeTeam': 210,
        'awayTeam': 16,
        'homeTeamGoals': 8,
        'awayTeamGoals': 2,
        'inProgress': true
      });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.UNAUTHORIZED);
    expect(chaiHttpResponse.body).to.deep.equal({
      message: 'Token must be a valid token'
    });
  });
})

describe('testa a rota patch /matches', () =>
{
  let chaiHttpResponse: Response;

  it('Verifica se é possível alterar o status inProgress de uma partida para false no banco de dados.', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/id/finish')
      .send({ 'id': 1 });

      expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Finished' });
  });

  it('Verifica se é possível alterar o resultado de uma partida em andamento.', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/id')
      .send({ 'id': 1, 'homeTeamGoals': 3, 'awayTeamGoals': 1 });

      expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
  });
});
