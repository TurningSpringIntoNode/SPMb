require('dotenv').config();

const express = require('express');
const compression = require('compression');
const logger = require('morgan');

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./core/routes');

routes(app);

module.exports = app;
