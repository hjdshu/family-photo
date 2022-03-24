var createError = require('http-errors');
var fs = require('fs')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('./config')
var userMiddleware = require('./util/userMiddleware')
var indexRouter = require('./routes/render/router');
var usersRouter = require('./routes/api/index');
var photoRouter = require('./routes/photo');
var app = express();

// 模拟创建数据库
if (!fs.existsSync('./database')) {
  fs.mkdirSync('./database')
  fs.mkdirSync('./database/photo')
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.signKey));

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, path, stat) {
    // if u want static files no-cache
    // res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }
}));

// 验证登录信息中间件
app.use(userMiddleware)

//if u want response no-cache
app.use(function (req, res, next) {
  // res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // res.setHeader('Pragma', 'no-cache');
  // res.setHeader('Expires', '0');
  next();
});

// router
app.use('/api', usersRouter);
app.use('/photo', photoRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
