const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const {
  createUser,
  loginUser,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', loginUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
