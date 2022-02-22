const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req = request, res = response, next) => {
  try {
    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: 'There is no token in the request',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);

    req.uid = payload.uid;

    next();
  } catch (err) {
    res.status(401).json({
      ok: false,
      msg: 'Token is not valid',
    });
  }
};

module.exports = { validateJWT };
