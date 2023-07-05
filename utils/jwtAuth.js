const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./constants');

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

const signToken = (payload) => jwt.sign(payload, SECRET_KEY);

module.exports = {
  checkToken,
  signToken,
};
