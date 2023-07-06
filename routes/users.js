const router = require('express').Router();
const {
  validateUserById,
  validateUserInfo,
  validateAvatar,
} = require('../middlewares/validate');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', validateUserById, getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
