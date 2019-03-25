const mongoose = require('mongoose');
const userPlugin = require('./plugins/user.plugin');
const { coordinatorEmail } = require('../../app.config');

const { Schema } = mongoose;

const CoordinatorSchema = new Schema({});

CoordinatorSchema.methods.toJSON = function () {
  const coordinator = this;
  return {
    name: coordinator.name,
    email: coordinator.email,
  };
};

CoordinatorSchema.plugin(userPlugin);

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

/** setup first coordinator */
const coordinator = new Coordinator({
  email: coordinatorEmail,
});

coordinator.save().catch(() => {});

module.exports = Coordinator;
