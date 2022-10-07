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

describe('testa a rota /team', () =>
{
  let chaiHttpResponse: Response;
  const teamMock: TeamDTO[] = [{
    id: 1,
    teamName: 'Avaí/Kindermann',
  }];

  before(() => {
    sinon
      .stub(TeamModel, 'findAll')
      .resolves(teamMock as TeamModel[]);
  });

  after(()=>{
    sinon.restore();
  })

  it('Retorna todos os times e um status 200', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/team');

    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
    expect(chaiHttpResponse.body).to.equal(teamMock);
  });

//   it('Não deve permitir fazer login sem um e-mail válido', async () =>
//   {
//     chaiHttpResponse = await chai
//       .request(app)
//       .post('/login')
//       .send({ password: 'secret_admin'});

//     expect(chaiHttpResponse.status).to.equal(StatusCodes.BAD_REQUEST);
//   });

//   it('Não deve permitir fazer login sem uma senha válida', async () =>
//   {
//     chaiHttpResponse = await chai
//       .request(app)
//       .post('/login')
//       .send({ email: 'admin@admin.com' });

//     expect(chaiHttpResponse.status).to.equal(StatusCodes.BAD_REQUEST);
//   });

});
