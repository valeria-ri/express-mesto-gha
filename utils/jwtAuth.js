const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

const checkToken = (token) => jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

const signToken = (payload) => jwt.sign(
  payload,
  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  { expiresIn: '7d' },
);

module.exports = {
  checkToken,
  signToken,
};
