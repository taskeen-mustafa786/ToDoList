const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a text value'],
    trim: true,
    maxlength: [100, 'Text cannot be more than 100 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);
