const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

beforeAll((done) => {
  mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.TEST_SUITE}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
  }, () => {
    mongoose.connection.db.dropDatabase();
    done();
  });
});

beforeEach( async (done) => {
  for(const model in mongoose.connection.models){
    await mongoose.connection.models[model].deleteMany({})
  }
  done();
});

afterAll(async () => {
  await mongoose.disconnect();
});