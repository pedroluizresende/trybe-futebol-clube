import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamModel';

import { Response } from 'superagent';
import TeamsController from '../controllers/TeamsController';
import TeamService from '../services/TeamService';

chai.use(chaiHttp);

const { expect } = chai;
const teams = [
  { id: 1, teamName: 'Palmeiras'},
  {id: 1, teamName: 'Bragantino'},
]

describe('testa rota /teams', () => {

  it('testa se retorna array de times, com status duzentos', async () => {
    sinon.stub(TeamService, 'getAll').resolves(teams as Team[])
    const response = await chai.request(app).get('/teams')

    expect(response.status).to.be.equal(200)
    expect(response.body).to.be.deep.equal(teams)
  } )

  it('testa se retorna um time, peli id', async () => {
    sinon.stub(TeamService, 'getById').resolves(teams[0] as Team)
    const response = await chai.request(app).get('/teams/1')

    expect(response.status).to.be.equal(200)
    expect(response.body).to.be.deep.equal(teams[0])
  } )

});
