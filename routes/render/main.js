
var api = require('./api.js')
const axios = require('axios')
var fs = require('fs')
var path = require('path');
var photoPath = ('../../database/photo');
var utils = require('../../util/utils');
function readJsonList (list) {
  var result = []
  list.forEach(function(n){
    let jsonBuffer = fs.readFileSync(path.resolve(__dirname, photoPath + '/' + n + '/img.json')) 
    let theJSON = JSON.parse(jsonBuffer.toString())
    theJSON.url = '/photo/' + n
    theJSON.rurl = '/photo/real/' + n
    theJSON.id = n
    result.push(theJSON)
  })
  return result
}

module.exports = {
  index: async function (req, res, next) {
    var list = fs.readdirSync(path.resolve(__dirname, photoPath))
    let result = readJsonList(list)
    res.render('index', {
      list: result
    })
  },
  shike: async function (req, res, next) {
    var id = req.params.id
    let resultBuffer = await utils.readFilePromise(path.resolve(__dirname, photoPath + '/' + id + '/img.json'))
    if (!resultBuffer) {
      next()
      return
    }
    let json = JSON.parse(resultBuffer.toString())
    json.url = '/photo/' + id
    json.rurl = '/photo/real/' + id
    res.render('shike', {
      shike: json
    })
  }
}