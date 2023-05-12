import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');

import MatchModel from '../database/models/MatchModel'

import { app } from '../app';
import { matchesMock, matchesMockWhithTeamName } from './mocks/matchesMock';
import Auth from '../utils/Auth';
import IUser, { IUserWithoutPassword } from '../database/interfaces/IUser';
import { log } from 'console';

chai.use(chaiHttp);

const { expect } = chai;

const tokenNotFoundMessage = {message: 'Token not found'}

const userAdmin: IUser = {
  id: 1,
  username: 'admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: 'secret_admin'
}

const tokenInvalidMessage = { message: 'Token must be a valid token' }

describe('Testa a rota /matches', () => { 
  describe('testa método get', () => {
    it('deve retornar um array de partidas', async () => {
      sinon.stub(MatchModel, 'findAll').resolves(matchesMockWhithTeamName as MatchModel[])
  
      const response = await chai.request(app)
      .get('/matches')
  
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesMockWhithTeamName)
    })
    
    it('deve retornar partidas em andamento ao receber inprogress igual "true"', async () => {
      sinon.stub(MatchModel, 'findAll').resolves([matchesMockWhithTeamName[1]] as MatchModel[]);
  
      const response = await chai.request(app)
      .get('/matches?inProgress=true');
  
      expect(response.status).to.be.equal(200)
  
      expect(response.body).to.be.deep.equal([matchesMockWhithTeamName[1]])
    })
    it('deve retornar partidas em andamento ao receber inprogress igual "true"', async () => {
      sinon.stub(MatchModel, 'findAll').resolves([matchesMockWhithTeamName[0]] as MatchModel[]);
  
      const response = await chai.request(app)
      .get('/matches?inProgress=false');
  
      expect(response.status).to.be.equal(200)
  
      expect(response.body).to.be.deep.equal([matchesMockWhithTeamName[0]])
    })
    afterEach(() => {
      sinon.restore();
    })
  })
  describe('testa a rota "/matches/:id/finish"', () => {
    it('retorna erro ao não informar token', async() => {
      
      const response = await chai.request(app)
      .patch('/matches/1/finish')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenNotFoundMessage)
    })
    it('retorna erro ao informar token inválido', async () => {

      const {email, password } = userAdmin 
      await chai.request(app).post('/login').send({email, password});
      const response = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'tokenInvalido')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenInvalidMessage)
    })
    it('retorna mensagem de sucesso ao atualizar', async () => {
      sinon.stub(MatchModel, 'update').resolves()
      const {email, password } = userAdmin 
      const login = await chai.request(app).post('/login').send({email, password});
      const { token } = login.body
      const response = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', token)

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({ message: 'Finished' })
    })
    afterEach(() => {
      sinon.restore();
    })
  })
  describe.only('testa a rota "matches/:id"', () => {
    it('retorna erro ao não informar token', async() => {
      
      const response = await chai.request(app)
      .patch('/matches/1')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenNotFoundMessage)
    })

    it('retorna erro ao informar token inválido', async () => {

      const {email, password } = userAdmin 
      await chai.request(app).post('/login').send({email, password});
      const response = await chai.request(app)
      .patch('/matches/1')
      .set('Authorization', 'tokenInvalido')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenInvalidMessage)
    })
    it('retorna mensagem de sucesso ao atualizar', async () => {
      sinon.stub(MatchModel, 'update').resolves()
      sinon.stub(MatchModel, 'findOne').resolves(matchesMockWhithTeamName[1] as MatchModel)
      const {email, password } = userAdmin 
      const login = await chai.request(app).post('/login').send({email, password});
      const { token } = login.body
      const response = await chai.request(app)
      .patch('/matches/2')
      .send({ homeTeamGoals: 3, awayTeamGoals: 2 })
      .set('Authorization', token)

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({
        ...matchesMockWhithTeamName[1],
      })
    })
    afterEach(() => {
      sinon.restore();
    })
  })
 }) 