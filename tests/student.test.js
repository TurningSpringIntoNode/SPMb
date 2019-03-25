process.env.TEST_SUITE = 'student';

const expect = require('chai').expect;
const request = require('supertest');
const _ = require('lodash');

const app = require('../app');
const { Discipline } = require('../models');
const { Coordinator, Student } = require('../models').Users;

const coordinator = {
  name: 'coordinator',
  email: 'coordinator@ccc.ufcg.edu.br'
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

const disciplines = [
  {
    id: '1',
    name: 'p1',
    period: 1,
    credits: 4,
    curricularGrade: ['NEW', 'OLD'],
    curricularType: 'REQUIRED',
  },
  {
    id: '2',
    name: 'lp1',
    period: 1,
    credits: 4,
    curricularGrade: ['NEW', 'OLD'],
    curricularType: 'REQUIRED',
  }
];

const populateCoordinator = () => {
  return new Coordinator(coordinator).save();
};

const populateFakeStudents = async () => {
  const prom = students.map(student => new Student(student).save());
  return Promise
          .all(prom);
};

const populateDisciplines = () => {
  const prom = disciplines.map(discipline => new Discipline(discipline).save());
  return Promise
          .all(prom);
};

const populateDB = () => {
  const prom = [
    populateCoordinator(),
    populateFakeStudents(),
    populateDisciplines(),
  ];
  return new Promise((resolve, reject) => {
    Promise
      .all(prom)
      .then(values => {
        const coordinator_db = values[0];
        const students_db = values[1];
        const disciplines_db = values[2];
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
              students: students_db,
              disciplines: disciplines_db
            })
          })
      })
      .catch(reject);
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
            expect(validStudents).to.equal(students.length);
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
              expect(student.name).to.equal(populated.students[0].name);
              expect(student.id).to.equal(populated.students[0]._id.toHexString());
              expect(student.email).to.equal(populated.students[0].email);
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
                expect(student.name).to.equal(populated.students[0].name);
                expect(student.id).to.equal(populated.students[0]._id.toHexString());
                expect(student.email).to.equal(populated.students[0].email);
                done();
              });
          });
      });
  });

  test('Not authorized get student by id', (done) => {
    populateDB()
      .then(populated => {
        request(app)
          .post('/auth/google')
          .send({
            user: {
              name: populated.students[1].name,
              email: populated.students[1].email
            },
            role: 'Student'
          })
          .expect(200)
          .then(res => res.body.token)
          .then(token => {
            request(app)
              .get(`/students/${populated.students[0]._id}`)
              .set('x-auth', token)
              .expect(401)
              .end(done);
          });
      });
  });

  test('Update disciplines', (done) => {
    populateDB()
      .then(populated => {
        request(app)
          .patch(`/students/${populated.students[0]._id}/disciplines`)
          .send({
            disciplines: [
              populated.disciplines[0]._id.toHexString()
            ]
          })
          .expect(200)
          .then(() => {
            request(app)
              .get(`/students/${populated.students[0]._id}/disciplines`)
              .expect(200)
              .then(res => res.body)
              .then((disciplines) => {
                expect(disciplines.length).to.equal(1);
                const db_discipline = _.pick(populated.disciplines[0], ['id', 'name', 'period', 'credits', 'curricularGrade', 'curricularType']);
                expect(disciplines[0]).to.deep.equal(db_discipline);
                done();
              });
          });
      })
  });

  test('Update disciplines of inexistent student', (done) => {
    populateDB()
      .then(populated => {
        request(app)
          .delete(`/students/${populated.students[0]._id}`)
          .set('x-auth', populated.token)
          .expect(200)
          .then(() => {
            request(app)
              .get(`/students/${populated.students[0]._id}/disciplines`)
              .expect(404)
              .end(done);
          });
      });
  });

});