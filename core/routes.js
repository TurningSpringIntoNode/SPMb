const authRouter = require('../routes/auth.route');
const studentsRouter = require('../routes/students.route');
const indexRouter = require('../routes/index.route');
const disciplinesRouter = require('../routes/disciplines.route');

const routes = (app) => {
  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/students', studentsRouter);
  app.use('/disciplines', disciplinesRouter);
};

module.exports = routes;
