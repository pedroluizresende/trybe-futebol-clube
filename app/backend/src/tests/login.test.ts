import * as sinon from 'sinon';
import * as chai from 'chai';
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
  password: 'secret_admin'
}

const invalidLoginMessage = { message: 'Invalid email or password' };

describe('testa a rota /login', () => {
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
    console.log('console.log:',User.build(mockUser))
    sinon.stub(Auth, 'generateToken').resolves('token')
    const response = await chai.request(app).post('/login').send({
      email: mockUser.email,
     password: mockUser.email
     });

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(token);
  })

  it('ao informar email inexistente retorna erro correto', async() => {
    sinon.stub(User, 'findOne').resolves(User.build(mockUser));
    const response = await chai.request(app).post('/login').send({
      email: 'email@email.com',
      password: mockUser.password,
    })

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal(invalidLoginMessage);
  })
  afterEach(() => {
    sinon.restore()
  })
});
