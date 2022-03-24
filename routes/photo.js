var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var fs = require('fs')
var path = require('path')
var images = require('images')
var multer  = require('multer')
var upload = multer()
var gm = require('gm')

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let pathGen = '../database/photo/'
  let id = req.params.id
  try {
    var jsonBuffer = fs.readFileSync(path.resolve(__dirname, `${pathGen}${id}/img.json`))
    let imgJSON = JSON.parse(jsonBuffer.toString())
    // 查找缩略图存不存在
    try {
      fs.statSync(path.resolve(__dirname, `${pathGen}${id}/thum.jpg`));
      let pathThum =  path.resolve(__dirname, `${pathGen}${id}/thum.jpg`)
      res.sendFile(pathThum)
    } catch (e) {
      let imgPath = path.resolve(__dirname, `${pathGen}${id}/${imgJSON.name}`)
      var files = images(imgPath)
      files.resize(120)
      let pathThum =  path.resolve(__dirname, `${pathGen}${id}/thum.jpg`)
      files.save(pathThum)
      res.sendFile(pathThum)
    }
  } catch (e) {
    console.log(e)
    next(createError(404))
  }
});

router.get('/real/:id', function(req, res, next) {
  let pathGen = '../database/photo/'
  let id = req.params.id
  try {
    var jsonBuffer = fs.readFileSync(path.resolve(__dirname, `${pathGen}${id}/img.json`))
    let imgJSON = JSON.parse(jsonBuffer.toString())
    let imgPath = path.resolve(__dirname, `${pathGen}${id}/${imgJSON.name}`)
    res.sendFile(imgPath)
  } catch (e) {
    next(createError(404))
  }
});


router.post('/upload', upload.any(), function(req, res, next){
  var file = req.files[0];
  var desp = req.body.desp;
  let pathGen = path.resolve(__dirname, '../database/photo/')

  console.log(file)

  var surrportTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg']

  if (!surrportTypes.find(function(n){ return n == file.mimetype})) {
    return res.send({
      errorno: 2,
      data: {},
      msg: '不支持的图片类型'
    })
  }

  if (file.size > 1000000) {
    res.send({
      errorno: 1,
      data: {},
      msg: '暂时不支持大图片'
    })
    return
  }

  var imgId = Math.floor(new Date().getTime() / 1000);
  fs.mkdirSync(path.join(pathGen, `${imgId}`))

  let imgType = file.mimetype.split('/')[1] || 'jpg'

  var json = JSON.stringify({
    name: `${imgId}.${imgType}`,
    desp: desp
  })
  fs.writeFileSync(path.join(pathGen, `${imgId}/img.json`), json)
  fs.writeFileSync(path.join(pathGen, `${imgId}/${imgId}.${imgType}`), file.buffer)

  res.send({
    errorno: 0,
    data: {}
  })

})

module.exports = router;