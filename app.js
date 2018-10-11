
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./config/passport-setup');

mongoose.connect(keys.mongo.uri, { useNewUrlParser: true });

mongoose.Promise = global.Promise;

const authRoutes = require('./routes/auth.route');
const studentsRoutes = require('./routes/students.route');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/students', studentsRoutes);

module.exports = app;