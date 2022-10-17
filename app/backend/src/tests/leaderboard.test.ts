import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota /leaderboard', () => {
  let chaiHttpResponse: Response;

  it('A requisição a /leaderboard/home deve trazer a classificação dos times que jogaram em casa', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/home')
      .send();

    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
  });

  it('A requisição a /leaderboard/away deve trazer a classificação dos times que jogaram fora de casa', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/away')
      .send();

    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
  });

  it('A requisição a /leaderboard deve trazer a classificação geral dos times', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard')
      .send();

    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
  });
});
