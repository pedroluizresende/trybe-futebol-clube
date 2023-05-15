import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');

import MatchModel from '../database/models/MatchModel'

import { app } from '../app';
import { matchesMock, matchesMockWhithTeamName, mockedTeam1, mockedTeam2, newMatch } from './mocks/matchesMock';
import Auth from '../utils/Auth';
import IUser, { IUserWithoutPassword } from '../database/interfaces/IUser';
import { INewMatch } from '../database/interfaces/IMatch';
import Team from '../database/models/TeamModel';
import User from '../database/models/UserModel';

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

const mockUser = {
  id: 1,
  username: 'admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: bcrypt.hashSync('secret_admin', 10)
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
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));

      const {email, password } = userAdmin 
      await chai.request(app).post('/login').send({email, password});

      const response = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'tokenInvalido')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenInvalidMessage)
    })
    it('retorna mensagem de sucesso ao atualizar', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
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
  describe('testa a rota "matches/:id"', () => {
    it('retorna erro ao não informar token', async() => {
      
      const response = await chai.request(app)
      .patch('/matches/1')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenNotFoundMessage)
    })

    it('retorna erro ao informar token inválido', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));

      const {email, password } = userAdmin 
      await chai.request(app).post('/login').send({email, password});
      const response = await chai.request(app)
      .patch('/matches/1')
      .set('Authorization', 'tokenInvalido')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenInvalidMessage)
    })
    it('retorna mensagem de sucesso ao atualizar', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
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
      expect(response.body).to.be.deep.equal({updatedId: 2})
    })
    afterEach(() => {
      sinon.restore();
    })
  })
  describe('testa a rota "POST /matches"', () => {
    it('retorna erro ao não informar token', async() => {
      
      const response = await chai.request(app)
      .post('/matches')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenNotFoundMessage)
    })

    it('retorna erro ao informar token inválido', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
      const {email, password } = userAdmin 
      await chai.request(app).post('/login').send({email, password});
      const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', 'tokenInvalido')

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(tokenInvalidMessage)
    })
    it('retornar a nova partida ao cadastrar com sucesso', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
      sinon.stub(MatchModel, 'create').resolves({id: 1, ...newMatch, inProgress: true} as MatchModel)
      sinon.stub(Team, 'findOne')
      .onCall(0).resolves(mockedTeam1 as Team).onCall(1).resolves(mockedTeam2 as Team)
      const {email, password } = userAdmin 
      const login = await chai.request(app).post('/login').send({email, password});
      const { token } = login.body
      const response = await chai.request(app)
      .post('/matches')
      .send(newMatch)
      .set('Authorization', token)

      expect(response.status).to.be.equal(201);
      expect(response.body).to.be.deep.equal({id: 1, ...newMatch, inProgress: true})
    })
    it('ao passar dois times iguais deve retornar um erro', async ()=> {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
      const {email, password } = userAdmin 
      const login = await chai.request(app).post('/login').send({email, password});
      const {token} = login.body;

      const response = await chai.request(app)
      .post('/matches')
      .send({
        homeTeamId: 1,
        awayTeamId: 1,
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      } as INewMatch)
      .set('Authorization', token)

      expect(response.status).to.be.equal(422)
      expect(response.body).to.be.deep.equal({message: 'It is not possible to create a match with two equal teams'})

    })
    it('ao passar ids de times que não existem, deve retornar erro', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
      sinon.stub(Team, 'findOne').onCall(0).resolves().onCall(1).resolves()
      const {email, password } = userAdmin 
      const login = await chai.request(app).post('/login').send({email, password});
      const {token} = login.body;

      const response = await chai.request(app)
      .post('/matches')
      .send({
        homeTeamId: 999,
        awayTeamId: 1,
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      } as INewMatch)
      .set('Authorization', token)

      expect(response.status).to.be.equal(404)
      expect(response.body).to.be.deep.equal({message: 'There is no team with such id!'})

    })
    afterEach(() => {
      sinon.restore();
    })
  })
 }) 