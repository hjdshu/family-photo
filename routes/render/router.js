var express = require('express');
var router = express.Router();
var main = require('./main')

/* GET home page. */
router.get('/', main.index);
router.get('/shike/:id', main.shike);
router.get('/login', function (req, res, next) {
  res.render('login')
})

module.exports = router;
