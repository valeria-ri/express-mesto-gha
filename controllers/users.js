const User = require('../models/user');
const {
  badRequestError,
  notFoundError,
  internalServerError,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(internalServerError).send({ message: 'Ошибка на сервере' }));
};

const getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(badRequestError).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
