const chai = require('chai');
const mongoose = require('mongoose');
const connectDB = require('../database.js');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

const { expect } = chai;
chai.use(chaiHttp);
const secretKey = process.env.JWT_SECRET_KEY;

describe('POST /api/findUser', () => {  
  it('should return an error if the token is missing', (done) => {
    chai.request(server)
    .post('/api/findUser')
    .send({})
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').eql('Missing parameters');
      done();
    });
  });
  
  it('should return an error if the session is not found or user does not match', (done) => {
    const token = jwt.sign({ username: 'wrongusername', sessionId: 'wrongsessionid' }, 'yourSecretKey');
    chai.request(server)
    .post('/api/findUser')
    .send({ token })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').eql('Invalid token');
      done();
    });
  });
  
  it('should return an error if the token is invalid', (done) => {
    chai.request(server)
    .post('/api/findUser')
    .send({ token: 'invalidtoken' })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').eql('Invalid token');
      done();
    });
  });
});
