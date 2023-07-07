const mongoose = require('mongoose');
const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/jwtAuth');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = checkToken(token);
  } catch (err) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }

  req.user = {
    _id: new mongoose.Types.ObjectId(payload._id),
  };
  return next();
};

module.exports = auth;
