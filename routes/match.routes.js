const { Router } = require('express');
const { check } = require('express-validator');
const { getMatches } = require('../controllers/match.controller');

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getMatches);

module.exports = router;
