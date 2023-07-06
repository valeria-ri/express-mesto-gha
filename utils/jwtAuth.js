const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./constants');

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

const signToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

module.exports = {
  checkToken,
  signToken,
};
