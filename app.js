require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('./config/passport-setup');
require('./core/mongodb').connect();


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./core/routes');

routes(app);

module.exports = app;
