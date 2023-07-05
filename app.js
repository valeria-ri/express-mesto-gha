const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const {
  HTTP_STATUS_NOT_FOUND,
} = require('./utils/responses');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(router);

app.use('*', (req, res) => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Задан неправильный путь' }));

app.listen(PORT);
