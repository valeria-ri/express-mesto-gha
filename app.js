const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { notFoundError } = require('./utils/errors');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6490bd684357e313e249bbe4',
  };

  next();
});

app.use(router);

app.use('*', (req, res) => res.status(notFoundError).send({ message: 'Задан неправильный путь' }));

app.listen(PORT);
