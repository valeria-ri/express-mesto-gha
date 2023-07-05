// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { HTTP_STATUS_UNAUTHORIZED } = require('../utils/responses');
const { checkToken } = require('../utils/jwtAuth');
// const { SECRET_KEY } = require('../utils/constants');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };

    next();
  } catch (err) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
//   }

//   const token = authorization.replace('Bearer ', '');

//   let payload;

//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//   } catch (err) {
//     return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
//   }

//   req.user = payload;

//   next();
// };
