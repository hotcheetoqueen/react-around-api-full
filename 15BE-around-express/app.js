const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { celebrate, Joi, errors } = require('celebrate');

// require('dotenv').config();
// console.log(process.env.NODE_ENV);

const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');

const ServerError = require('./errors/ServerError.js');

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);


app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(26),
    about: Joi.string().min(2).max(36),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    // avatar: Joi.validate(string, ['http', 'https']),
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required(),
  }),
}), createUser);

app.use(errors());

app.use(auth);

app.use('/cards', cardsRoute);
app.use('/users', usersRoute);

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message })
})


app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
