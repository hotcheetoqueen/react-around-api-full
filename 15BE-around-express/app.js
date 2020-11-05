const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cardsRoute = require('./routes/cards');
const usersRoute = require('./routes/users');
const adminRoute = require('./routes/admins');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5f81ef1a30cefaa45ca45b67',
  };
  next();
});

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/cards', cardsRoute);
app.use('/users', usersRoute);
app.use('/', adminRoute);

app.use(errorLogger);
// app.use(errors());

// centralized error handler
// app.use((err, req, res, next) => {
  // ...
// });

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
