
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./config/passport-setup');

mongoose.connect(keys.mongo.uri, { useNewUrlParser: true });

mongoose.Promise = global.Promise;

const authRouter = require('./routes/auth.route');
const studentsRouter = require('./routes/students.route');
const indexRouter = require('./routes/index.route');
const disciplinesRouter = require('./routes/disciplines.route');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/students', studentsRouter);
app.use('/disciplines', disciplinesRouter);

module.exports = app;