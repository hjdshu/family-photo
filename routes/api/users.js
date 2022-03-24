var express = require('express');
var router = express.Router();
var config = require('../../config')
var MD5 = require('md5')

/* GET users listing. */
router.get('/name', function(req, res, next) {
  res.send({
    errno: 0,
    data: {
      nick: req.usernick
    }
  })
})

// login
router.post('/login', function(req, res){
  var user = req.body.user
  var password = req.body.password
  var passwordMD5 = MD5(password)

  // 不是生产的正确实践，MD5(config.user[user] 这里模拟数据库存的用户密码的md5值，这里简化了
  if (config.user[user] && MD5(config.user[user]) == passwordMD5) {
    // 这里也不是很规范的用法， 明白原理就好了
    res.cookie("user", user, {maxAge: 1000 * 60 * 60 * 24 * 0.5, signed: true})
    res.cookie("password", passwordMD5, {maxAge: 1000 * 60 * 60 * 24 * 0.5, signed: true})
    res.send({
      errno: 0,
      data: {
        login: true
      }
    })
  } else {
    res.send({
      errno: 401
    })
  }
})

module.exports = router;
