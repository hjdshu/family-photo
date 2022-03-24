var express = require('express');
var router = express.Router();
var user = require('./users.js')
router.use('/user', user)

module.exports = router;