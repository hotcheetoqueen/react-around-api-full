const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const validator = require('validator');
// const jwt = require('./utils/jwt');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// const auth = require('./middlewares/auth');

const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
// const adminRoute = require('./routes/admins');

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


app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/cards', cardsRoute);
app.use('/users', usersRoute);

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    console.log('if', err);
    res.status(500).send({ message: 'Hmmph, something is not right' });
  } else {
    console.log('else', err);
    res.status(err.statusCode).send({ message: err.message })
  }
})


app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
