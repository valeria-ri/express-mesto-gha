const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('../utils/responses');

const internalServerErrorHandler = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'Ошибка на сервере'
        : message,
    });
  next();
};

module.exports = internalServerErrorHandler;
