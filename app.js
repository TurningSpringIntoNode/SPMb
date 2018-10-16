
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./config/passport-setup');

mongoose.connect(keys.mongo.uri, { useNewUrlParser: true });

mongoose.Promise = global.Promise;

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./core/routes');

routes(app);

module.exports = app;
