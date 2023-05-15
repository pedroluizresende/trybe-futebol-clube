import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { leaderBoardMock } from './mocks/leaderBoardMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota "/leaderboard/home"', () => {
  describe.only('no endpoint "GET /leaderboard/home"', () => {
    it('deverá retornar array com todos os times e seus dados', async () => {
      const response = await chai.request(app)
      .get('/leaderBoard/home')

      expect(response.status).to.be.equal(200)
      expect(response.body).to.be.deep.equal(leaderBoardMock)
    })
  })
})