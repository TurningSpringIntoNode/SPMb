const expect = require('expect.js');
const request = require('supertest');

const app = require('../app');
const { Discipline } = require('../models');
const { Student, Coordinator } = require('../models').Users;



const testUser = {
  name: 'Tester',
  email: 'tester@tester.com',
};

describe('Auth', () => {

  test('Coordinator successful auth', (done) => {

    new Coordinator(testUser)
      .save()
      .then(() => {
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
      })
  });

  test('Coordinator unregistered auth', (done) => {

    request(app)
      .post('/auth/google')
      .send({
        user: {
          name: 'Sem nome',
          email: 'rr@gg.com'
        },
        role: 'Coordinator'
      })
      .expect(401)
      .end(done);
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
      .expect(401)
      .end(done);
  });
  
  test('Student successful auth', (done) => {
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

  test('Update user name', (done) => {
    const studentd = {
      email: 'student@s.com'
    };
    const student = new Student(studentd);
    student
      .save()
      .then(() => {
        request(app)
          .post('/auth/google')
          .send({
            user: {
              ...studentd,
              name: 'student_test'
            },
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
                  email: user.email,
                  name: user.name
                }).to.eql({
                  email: 'student@s.com',
                  name: 'student_test'
                });
                done();
              });
          });
      })
  });

  test('Log already saved user', (done) => {
    const student = {
      email: 'fulano@beltrano.com',
      name: 'Fulano'
    };
    new Student(student)
      .save()
      .then(() => {
        request(app)
          .post('/auth/google')
          .send({
            user: student,
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
                const {email, name} = user;
                expect({
                  email,
                  name
                }).to.eql(student);
                done();
              });
          });
      });
  });
});
