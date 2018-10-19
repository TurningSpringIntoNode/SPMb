const mongoose = require('mongoose');
const userPlugin = require('./plugins/user.plugin');

const Schema = mongoose.Schema;

const CoordinatorSchema = new Schema({});

CoordinatorSchema.plugin(userPlugin);

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

module.exports = Coordinator;
