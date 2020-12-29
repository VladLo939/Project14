const Cards = require('../models/card');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((cards) => res.json({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
      } else res.status(500).json({ message: `Ошибка при чтении файла: ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndDelete(req.params.id)
    .orFail(new Error('notValidId'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'notValidId') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
