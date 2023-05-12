import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs'
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import LoginService from '../services/LoginService';
import User from '../database/models/UserModel';
import IUser from '../database/interfaces/IUser';
import Auth from '../utils/Auth';

chai.use(chaiHttp);

const { expect } = chai;

const errorMessage = { message: 'All fields must be filled' };
const token = {token: 'token'}
const mockUser = {
  id: 1,
  username: 'admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: bcrypt.hashSync('secret_admin', 10)
}

const invalidLoginMessage = { message: 'Invalid email or password' };

describe('testa a rota /login', () => {
  describe('testa método post da rota /login', () => {
    it('ao nao informar um email retorna mensagem de erro', async () => {
      const response = await chai.request(app).post('/login').send({ password: '1233456' });
  
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal(errorMessage);
    });
    it('ao nao informar uma senha retorna mensagem de erro', async () => {
      const response = await chai.request(app).post('/login').send({ email: 'email@email' });
  
      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal(errorMessage);
    });
    it('ao informar email e password válidos retorna um token', async () => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser));
    sinon.stub(Auth, 'generateToken').resolves('token')
    const response = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'secret_admin', 
    });
  
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(token);
    })
  
    it('ao informar email inexistente retorna erro correto', async() => {
      sinon.stub(User, 'findOne').resolves(undefined);
      const response = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: mockUser.password,
      })
  
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(invalidLoginMessage);
    })
    it('ao informar senha incorreta retorna erro', async() => {
      sinon.stub(User, 'findOne').resolves(User.build(mockUser))
      const response = await chai.request(app).post('/login').send({
        email: mockUser.email,
        password: 'senha_invalida',
      })
  
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal(invalidLoginMessage);
  
    })
    afterEach(() => {
      sinon.restore()
    })
  })
  describe('testa método get da rota /login/role', () =>{
    it('se o token não for informado retorna um erro', async () => {
      const response = await chai.request(app).get('/login/role');

      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal({message: 'Token not found'})
    })
  })
  it('ao passar token inválido retorna erro', async () => {
    const response = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', 'Bearer token_invalido');

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token must be a valid token' });
  })
  it('ao passar um token válido devera retornar a role do usuário', async () =>{
    const {id, username, role, email} = mockUser
  const token = Auth.generateToken({id, username, role, email})
  sinon.stub(Auth, 'validateToken').resolves({id, username, role, email})

  const response = await chai
    .request(app)
    .get('/login/role')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).to.be.equal(200);
  expect(response.body).to.haveOwnProperty('role');
  expect(response.body.role).to.be.equal('admin');
  })
  afterEach(() => {
    sinon.restore()
  })
});
