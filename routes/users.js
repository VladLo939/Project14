const userRouter = require('express').Router();
const { getUser, getUserId, createUser } = require('../controllers/users');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.post('/', createUser);

module.exports = userRouter;
