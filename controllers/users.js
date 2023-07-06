const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../utils/jwtAuth');

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/errors');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  MONGO_DUPLICATE_KEY_ERROR,
} = require('../utils/responses');

const { SALT_ROUNDS } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.status(HTTP_STATUS_OK).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неверный email или пароль');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      const token = signToken({ _id: user._id });
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next, newData) => {
  User
    .findByIdAndUpdate(req.user._id, newData, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  loginUser,
  updateUserInfo,
  updateUserAvatar,
};
