require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const notFound = require('./routes/notFound');

app.use(apiLimiter);

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use(notFound);

app.listen(PORT, () => {
});
