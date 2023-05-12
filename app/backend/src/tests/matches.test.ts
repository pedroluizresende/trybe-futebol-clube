import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');

import MatchModel from '../database/models/MatchModel'

import { app } from '../app';
import matchesMock from './mocks/matchesMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota /matches', () => { 
  it('deve retornar um array de partidas', async () => {
    sinon.stub(MatchModel, 'findAll').resolves(matchesMock as MatchModel[])
  })
  afterEach(() => {
    sinon.restore().
  })
 })