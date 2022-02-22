/* 
    path: /api/user
*/
const { Router } = require('express');
const { check } = require('express-validator');

// Controllers
const {
  registerUser,
  loginUser,
  listUsers,
  renewToken,
} = require('../controllers/user.controller');

// Middlewares
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Register User
router.post(
  '/register',
  [
    check('nickname', 'Nickname is required').isString().not().isEmpty(),
    check('email', 'Email is required').isEmail().not().isEmpty(),
    check('password', 'Password is required').isString().not().isEmpty(),
    validateFields,
  ],
  registerUser
);

// Login User
router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail().not().isEmpty(),
    check('password', 'Password is required').isString().not().isEmpty(),
    validateFields,
  ],
  loginUser
);

// List Users
router.get('/', validateJWT, listUsers);

// Renew Token
router.get('/renew-token', validateJWT, renewToken);

module.exports = router;
