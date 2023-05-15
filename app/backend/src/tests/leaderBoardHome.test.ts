import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { leaderBoardMock, matchMock, teamsMock } from './mocks/leaderBoardMock';
import Team from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('testa a rota "/leaderboard"', () => {
  describe('no endpoint "GET /leaderboard/home"', () => {
    it('deverá retornar array com todos os times e seus dados', async () => {
      sinon.stub(Team, 'findAll').resolves(teamsMock as Team[])
      sinon.stub(MatchModel, 'findAll').resolves(matchMock as MatchModel[])
     
      const response = await chai.request(app)
      .get('/leaderBoard/home')

      expect(response.status).to.be.equal(200)
      expect(response.body).to.be.deep.equal(leaderBoardMock)
    })
    afterEach(() => {
      sinon.restore()
    })
  })
  describe('no endpoint "GET /leaderboard/away"', () => {
    it('deverá retornar array com todos os times e seus dados', async () => {
      sinon.stub(Team, 'findAll').resolves(teamsMock as Team[])
      sinon.stub(MatchModel, 'findAll').resolves(matchMock as MatchModel[])
     
      const response = await chai.request(app)
      .get('/leaderBoard/away')

      expect(response.status).to.be.equal(200)
      expect(response.body).to.be.deep.equal(leaderBoardMock)
    })
    afterEach(() => {
      sinon.restore()
    })
  })
})