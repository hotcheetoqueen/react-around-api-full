const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const validator = require('validator');
const auth = require('./utils/jwt');

const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
const adminRoute = require('./routes/admins');

const ServerError = require('./errors/ServerError.js');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());
app.options('*', cors());

// app.use(validator);

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

app.use('/cards', auth.isAuthorized, cardsRoute);
app.use('/users', auth.isAuthorized, usersRoute);
app.use('/', adminRoute);


app.use(errorLogger);
// app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    throw new ServerError('Hmmph, something is not right');
  }

  res.status(err.statusCode).send({ message: err.message })
  .catch(next);
})


app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
