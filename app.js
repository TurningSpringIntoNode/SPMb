
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('./config/passport-setup');

const authRoutes = require('./routes/auth.route');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

module.exports = app;