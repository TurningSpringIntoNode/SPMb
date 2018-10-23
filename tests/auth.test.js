const expect = require('expect.js');
const request = require('supertest');

const app = require('../app');
const { Discipline } = require('../models');
const { Student, Coordinator } = require('../models').Users;

const testUser = {
  name: 'Tester',
  email: 'tester@tester.com',
};

describe('Auth coordinator', () => {

  test('Successful auth', (done) => {
    request(app)
      .post('/auth/google')
      .send({
        user: testUser,
        role: 'Coordinator',
      })
      .expect(200)
      .then(res => res.body.token)
      .then((token) => {
        request(app)
          .get('/me')
          .set({ 'x-auth': token })
          .expect(200)
          .then(res => res.body)
          .then((user) => {
            expect(user).to.eql(testUser);
            done();
          });
      });
  });

  test('Wrong role', (done) => {
    request(app)
      .post('/auth/google')
      .send({
        user: testUser,
        role: 'wwww',
      })
      .expect(400)
      .end(done);
  });

  test('No user supplied', (done) => {
    request(app)
      .post('/auth/google')
      .expect(400)
      .end(done);
  });
});

describe('Auth Student', () => {
  
  test('Successful auth', (done) => {
    request(app)
      .post('/auth/google')
      .send({
        user: testUser,
        role: 'Student'
      })
      .expect(200)
      .then(res => res.body.token)
      .then(token => {
        request(app)
          .get('/me')
          .set('x-auth', token)
          .expect(200)
          .then(res => res.body)
          .then(user => {
            expect({
              name: user.name,
              email: user.email,
            }).to.eql(testUser);
            done();
          });
      })
  });

});
