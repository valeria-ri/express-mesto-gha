const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { BadRequestError } = require('../errors/errors');

const validateURL = (url) => {
  if (!isURL(url)) {
    throw new BadRequestError('Неправильный формат ссылки');
  }
  return url;
};

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  validateSignin,
  validateSignup,
  validateUserById,
  validateUserInfo,
  validateAvatar,
  validateCard,
  validateCardId,
};
