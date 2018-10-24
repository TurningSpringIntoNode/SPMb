process.env.TEST_SUITE = 'student';

const expect = require('expect.js');
const request = require('supertest');

const app = require('../app');
const { Coordinator, Student } = require('../models').Users;

const coordinator = {
  name: 'coordinator',
  email: 'coordinator@ccc.ufcg.edu.br'
};

const populateCoordinator = () => {
  return new Coordinator(coordinator).save();
};

const students = [
  {
    name: 'fulanoo',
    email: 'fulano1@ccc.ufcg.edu.br'
  },
  {
    name: 'fulaninho',
    email: 'fulano2@ccc.ufcg.edu.br'
  },
  {
    name: 'fulaninhioo',
    email: 'fulano3@ccc.ufcg.edu.br'
  }
];


const populateFakeStudents = async () => {
  return new Promise((resolve, reject) => {
    const prom = students.map(student => new Student(student).save());
    Promise
      .all(prom)
      .then(values => resolve(values))
      .catch(err => reject(err))
  });
};

const populateDB = () => {
  return new Promise((resolve, reject) => {
    populateCoordinator()
      .then((coordinator_db) => {
        populateFakeStudents()
          .then((students_db) => {
            request(app)
              .post('/auth/google')
              .send({
                user: coordinator,
                role: 'Coordinator'
              })
              .then(res => res.body.token)
              .then(token => {
                resolve({
                  token,
                  coordinator: coordinator_db,
                  students: students_db
                });
              });
          });
      })
      .catch(err => reject(err));
  });
};

describe('Students', () => {

  test('Get all students', (done) => {
    populateDB()
      .then(populated => {
        request(app)
          .get('/students')
          .set('x-auth', populated.token)
          .expect(200)
          .then(res => res.body)
          .then((studentsAp) => {
            const validStudents = students.reduce((prev, elem) => {
              const index = studentsAp.indexOf(
                studentsAp.find((e) => {
                  return e.email === elem.email;
                })
              );
              const value = index == -1 ? 0 : 1;
              return prev + value;
            }, 0);
            expect(validStudents).to.eql(students.length);
            done();
          });
      });
  });

  test('Get student by id (coordinator)', (done) => {
    populateDB()
      .then(populated => {
          request(app)
            .get(`/students/${populated.students[0]._id}`)
            .set('x-auth', populated.token)
            .expect(200)
            .then(res => res.body)
            .then(student => {
              expect(student.name).to.eql(populated.students[0].name);
              expect(student.id).to.eql(populated.students[0]._id.toHexString());
              expect(student.email).to.eql(populated.students[0].email);
              done();
            });
      });
  });

  test('Get student by id (student)', (done) => {
    populateDB()
      .then(populated => {
        request(app)
          .post('/auth/google')
          .send({
            user: {
              name: populated.students[0].name,
              email: populated.students[0].email
            },
            role: 'Student'
          })
          .expect(200)
          .then(res => res.body.token)
          .then(token => {
            request(app)
              .get(`/students/${populated.students[0]._id}`)
              .set('x-auth', token)
              .expect(200)
              .then(res => res.body)
              .then(student => {
                expect(student.name).to.eql(populated.students[0].name);
                expect(student.id).to.eql(populated.students[0]._id.toHexString());
                expect(student.email).to.eql(populated.students[0].email);
                done();
              });
          });
      });
  });

});