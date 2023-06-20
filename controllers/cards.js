const Card = require('../models/card');
const {
  notFoundError,
  internalServerError,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(internalServerError).send({ message: 'Ошибка на сервере' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => res.status(internalServerError).send({ message: 'Ошибка на сервере' }));
};

const deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then(() => res.status(200).send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

const likeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.status(internalServerError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
