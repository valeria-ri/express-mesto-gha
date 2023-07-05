const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  MONGO_DUPLICATE_KEY_ERROR,
} = require('../utils/responses');
const { SALT_ROUNDS } = require('../utils/constants');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.status(HTTP_STATUS_OK).send({ data: users }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

const getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

const createUser = (req, res) => {
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
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
        res.status(HTTP_STATUS_CONFLICT).send({ message: 'Такой пользователь уже существует' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new Error('UnauthorizedError');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неверный email или пароль' });
        return;
      }

      const token = signToken({ _id: user._id });

      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch((err) => {
      if (err.message === 'UnauthorizedError') {
        res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неверный email или пароль' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

const updateUser = (req, res, newData) => {
  User
    .findByIdAndUpdate(req.user._id, newData, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  return updateUser(req, res, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return updateUser(req, res, { avatar });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUserInfo,
  updateUserAvatar,
};
