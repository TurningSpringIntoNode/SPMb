module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spmb',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR CLIENT ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR CLIENT SECRET',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'YOUR SECRET',
  },
  coordinatorEmail: process.env.COORDINATOR_EMAIL || 'COORDINATOR EMAIL',
};
