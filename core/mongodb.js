const mongoose = require('mongoose');
const config = require('../app.config');

mongoose.Promise = global.Promise;

exports.mongoose = mongoose;

exports.connect = () => {
  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  return mongoose;
};
