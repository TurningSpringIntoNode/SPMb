const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

beforeAll((done) => {
  mongoose.connect('mongodb://127.0.0.1:27017/spmb', {
    useNewUrlParser: true,
    useCreateIndex: true,
  }, () => {
    mongoose.connection.db.dropDatabase();
    done();
  });
});

beforeEach( async () => {
  for(const model in mongoose.connection.models){
    await mongoose.connection.models[model].deleteMany({})
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});