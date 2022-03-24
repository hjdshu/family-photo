var fs = require('fs')

function readFilePromise(filePath){
	return new Promise(function(resolve,reject){
	fs.readFile(filePath,'utf8',function(err, data){
		if(err){
			resolve(null)
		}else {
			resolve(data)		
		}
	})
 })
}

module.exports = {
  readFilePromise: readFilePromise
}