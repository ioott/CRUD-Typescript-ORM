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

  // O avaliador verificará se é possível fazer o login com dados corretos e que, após o acesso, será redirecionado para a tela de jogos.
  // Se o login foi feito com sucesso, o resultado retornado deverá ser um token, com um status http 200.


  let chaiHttpResponse: Response;
  const userMock: LoginDTO = {username: 'user name', role: 'my role', email: 'test@test.com', password: '123456'};

  before(async () => {
    sinon
      .stub(UserModel, 'create')
      .resolves({ id:1, ...userMock } as UserModel);
  });

  after(()=>{
    sinon.restore();
  })

  it('Deve fazer o login com sucesso e redirecionar o usuário para a tela de jogos', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(userMock);

    expect(response.status).to.equal(200);
    expect(response.header).to.hasOwnProperty('token');
    // expect(???).toBe('/matches');
  });


    /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('Seu sub-teste', () => {
    expect(false).to.be.eq(true);
  });
});
