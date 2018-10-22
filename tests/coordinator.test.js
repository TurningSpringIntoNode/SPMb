const expect = require('expect.js');
const request = require('supertest');
const app = require('../app');
const { Discipline } = require('../models');
const { Student, Coordinator } = require('../models').Users;

beforeEach((done) => {
  Coordinator
    .deleteMany({})
    .then(() => done())
});

describe('POST /auth/google', () => {

  it('Successful auth', (done) => {
    const testUser = {
      name: 'Tester',
      email: 'tester@tester.com',
    };
    request.agent(app)
      .post('/auth/google')
      .send({
        user: testUser,
        role: 'Coordinator',
      })
      .expect(200)
      .then(res => res.body.token)
      .then(token => {
        request(app)
          .get('/me')
          .set({ 'x-auth': token })
          .expect(200)
          .then(res => res.body)
          .then(user => {
            expect(user).to.eql(testUser);
            done();
          })
      });
  });

});