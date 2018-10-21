const mongoose = require('mongoose');
const userPlugin = require('./plugins/user.plugin');
const { coordinatorEmail } = require('../../config/keys');

const { Schema } = mongoose;

const CoordinatorSchema = new Schema({});

CoordinatorSchema.plugin(userPlugin);

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

/** setup first coordinator */
const coordinator = new Coordinator({
  email: coordinatorEmail,
});

coordinator.save();

module.exports = Coordinator;
