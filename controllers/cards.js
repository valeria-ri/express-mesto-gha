const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/responses');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/errors');

const getCards = (req, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Нет прав для удаления карточки');
      }
      return card
        .deleteOne()
        .then(() => res.status(HTTP_STATUS_OK).send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Удаление карточки с некорректным id'));
      } else {
        next(err);
      }
    });
};

const updateCard = (req, res, next, newData) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      newData,
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для изменения состояния лайка'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => updateCard(
  req,
  res,
  next,
  { $addToSet: { likes: req.user._id } },
);

const dislikeCard = (req, res, next) => updateCard(
  req,
  res,
  next,
  { $pull: { likes: req.user._id } },
);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
