const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;

exports.mongoose = mongoose;

exports.connect = () => {
  mongoose.connect(keys.mongo.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  return mongoose;
};
