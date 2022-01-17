const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        data: 'User Routes',
        message: 'OK'
    })
});

module.exports = router;
