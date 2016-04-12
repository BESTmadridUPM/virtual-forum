/*Requires */

var express = require('express');
var path = require('path');
var http = require('http');
var exec = require('child_process').exec;
var multer = require('multer');
var fs = require('fs');
require('prototypes');

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
	app.set('port', 10000);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);

	// Static files
	app.use(express.static(path.join(__dirname, '..', 'frontend')));
});

app.post('/webhook/', (req,res) => {
	exec(`cd /home/virtual-forum && git pull && npm install && forever restartall`,(error)=>{
		if (error) return res.send(error);
		return res.send(200);
	});
});
app.get('//api/cv-report/', (req, res) => {
	var cvPath = '/var/www/clients/client1/web1/web/subidaCV/cvs/';
	var timeStamp = (new Date()).toISOString().substringUpTo('Z');
	var destinationPath = `${cvPath}../reports/cv-report${timeStamp}.csv`;
	exec('ls -R ' + cvPath, (error, response) => {
		var responseSplitted = response.split('\n');
		var result = {};
		var currentSchool = '';
		var resultString = '';
		responseSplitted.forEach((line) => {
			if(line.contains(cvPath)){
				currentSchool = line.substringFrom(cvPath).substringUpTo(':');
				result[currentSchool] = 0;
			}
			if(line.contains('.pdf')) {
				result[currentSchool] ++;
			}
		});
		for (var school in result){
			resultString += `${school},${result[school]} \n`;
		}
		fs.writeFile(destinationPath, resultString, (err) => {
			fs.chmodSync(destinationPath, 0777);
			return res.download(destinationPath);
		});
	});
});
app.post('//api/uploadCV/', function (request, response) {
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
