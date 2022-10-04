import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';
import LoginDTO from '../interfaces/loginDTO';
import { response } from 'express';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota /login', () =>
{
  let chaiHttpResponse: Response;
  const userMock: LoginDTO = {email: 'test@test.com', password: '123456'};

  before(async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves({ ...userMock } as UserModel);
  });

  after(()=>{
    sinon.restore();
  })

  it('Deve fazer o login com sucesso e redirecionar o usuário para a tela de jogos', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userMock);

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.header).to.hasOwnProperty('token');
  });

  it('Não deve permitir fazer login sem um e-mail válido', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({email: '', password: '123456'});

    expect(chaiHttpResponse.status).to.equal(400);
  });

  it('Não deve permitir fazer login sem uma senha válida', async () =>
  {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({email: 'test@test.com', password: ''});

    expect(chaiHttpResponse.status).to.equal(400);
  });

});
