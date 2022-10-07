import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp  from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { Response } from 'superagent';
import LoginDTO from '../interfaces/loginDTO';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota /login', () =>
{
  let chaiHttpResponse: Response;
  const userMock: LoginDTO = {
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  };

  before(() => {
    sinon.stub(UserModel, 'findOne')
      .resolves({ ...userMock } as UserModel);
  });

  after(()=>{
    sinon.restore();
  })

  it('Deve fazer o login com sucesso e redirecionar o usuário para a tela de jogos', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ 'email': 'admin@admin.com', "password": "secret_admin" });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.OK);
    expect(chaiHttpResponse.header).to.hasOwnProperty('token');
  });

  it('Não deve permitir fazer login sem um e-mail válido', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ password: 'secret_admin'});

    expect(chaiHttpResponse.status).to.equal(StatusCodes.BAD_REQUEST);
  });

  it('Não deve permitir fazer login sem uma senha válida', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@admin.com' });

    expect(chaiHttpResponse.status).to.equal(StatusCodes.BAD_REQUEST);
  });

});
