const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
