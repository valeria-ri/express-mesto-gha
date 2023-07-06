const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const {
  validateSignin,
  validateSignup,
} = require('../middlewares/validate');
const {
  createUser,
  loginUser,
} = require('../controllers/users');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, loginUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
