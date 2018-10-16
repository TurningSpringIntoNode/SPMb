const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoordinatorSchema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      default: '',
    },
  },
});

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

module.exports = Coordinator;
