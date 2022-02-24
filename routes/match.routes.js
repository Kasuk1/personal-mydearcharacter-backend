const { Router } = require('express');
const { check } = require('express-validator');
const {
  getMatches,
  getMatchesByUserId,
} = require('../controllers/match.controller');

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getMatches);
router.get('/:userId', validateJWT, getMatchesByUserId);

module.exports = router;
