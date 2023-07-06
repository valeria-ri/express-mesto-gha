const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { NotFoundError } = require('./errors/errors');
const internalServerErrorHandler = require('./middlewares/internalServerErrorHandler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(router);

app.use(errors());

app.use('*', (req, res, next) => next(new NotFoundError('Задан неправильный путь')));

app.use(internalServerErrorHandler);

app.listen(PORT);
