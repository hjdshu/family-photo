var config = require('../config')
var MD5 = require('md5')
var userMiddleware = function (req, res, next) {
  if (/login/.test(req.originalUrl)) {
    next()
  } else {
    let user = req.signedCookies && req.signedCookies.user || ''
    let passwordMD5 = req.signedCookies && req.signedCookies.password || ''
    if (!config.user[user] || !MD5(config.user[user]) == passwordMD5) {
      res.redirect('/login')
      return
    }
    // todo如果验证成功就延长cookie过期时间
    req.usernick = user
    next()
  }
}

module.exports = userMiddleware