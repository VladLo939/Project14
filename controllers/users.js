const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.json({ data: users }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).json({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).json({ message: 'Невалидный id' });
      } else if (err.message === 'Not found') {
        res.status(404).json({ message: 'объект не найден' });
      } else res.status(500).json({ message: 'Ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const patten = new RegExp(/[A-Za-z0-9]{8,}/);
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!patten.test(password)) {
    res.status(400).send({ message: 'Invalid password' });
  } else if (!password) {
    res.status(400).send({ message: 'user validation failed: password: Path `password` is required.' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.json({
      _id: user._id, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
      } else if (err.name === 'MongoError' || err.code === 11000) {
        res.status(409).json({ message: 'Conflict' });
      } else {
        res.status(500).json({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
