/*Requires */

var express = require('express');
var path = require('path');
var http = require('http');
var multer = require('multer');
var fs = require('fs');

var app = express();
var done = false;

var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({ storage : storage}).single('CV');

app.configure(function(){

	// Basic configuration
	app.set('port', 3000);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);

	// Static files
	app.use(express.static(path.join(__dirname, '..', 'frontend')));
});


app.post('/api/uploadCV/', function (request, response) {
	var newPath = '/home/jfcobarea/BEST/IT/uploads/uploadedFileName.pdf';
	fs.rename(request.files.CV.path, newPath, function (err, data) {
	  response.send('request');
	});
});

// Server creation

var server = http.createServer(app);
server.on('connection', function(socket) {
	socket.setTimeout(1000 * 60 * 60); // 1h
});
server.listen(app.get('port'), function(){
	console.log('Running on port: ', app.get('port'));
});
