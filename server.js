const cors = require('cors');
const app = require('./app');

require('./config/passport-setup');
require('./core/mongodb').connect();

app.use(cors());

module.exports = app;
