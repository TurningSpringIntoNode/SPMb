const expect = require('expect.js');
const request = require('supertest');

const app = require('../app');
const mongoDB = require('../core/mongodb');
const { Discipline } = require('../models');
const { Student, Coordinator } = require('../models').Users;


describe('POST /auth/google', () => {

  beforeAll(() => {
    mongoDB.connect();
  });

  beforeEach((done) => {
    Coordinator.deleteMany({}).then(() => done());
  });

  afterAll((done) => {
    mongoDB.disconnect(done);
  });

  const testUser = {
    name: 'Tester',
    email: 'tester@tester.com',
  };

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
});
