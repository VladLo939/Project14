/* eslint-disable linebreak-style */
module.exports.notFound = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};
