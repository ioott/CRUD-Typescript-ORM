import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';
import TeamDTO from '../interfaces/teamDTO';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota /teams', () =>
{
  let chaiHttpResponse: Response;
  const teamsMock: TeamDTO[] = [{ id: 1, teamName: 'Avaí/Kindermann' }];

  before(() => {
    sinon.stub(TeamModel, 'findAll')
      .resolves([...teamsMock] as TeamModel[]);
  });
  after(() => {
    sinon.restore();
  })

  it('Retorna todos os times e um status 200', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams');
    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.equal(teamsMock);
  });
});

describe('Testa a rota /teams/id', () =>
{
  let chaiHttpResponse: Response;
  const teamMock: TeamDTO = { id: 1, teamName: 'Avaí/Kindermann' };

  before(() => {
    sinon.stub(TeamModel, 'findOne')
      .resolves({ ...teamMock } as TeamModel);
  });
  after(() => {
    sinon.restore();
  })

  it('Deve retornar um time específico e um status 200', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/id')
      .send({ id: '1' });
    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.deep.equal(teamMock);
  });
});
