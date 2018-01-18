var http = require('http');
var https = require('https');
var request = require('request-promise');
var express = require('express');
	
var app = express();

var port = 8080;
	
app.listen(port, () => {
  console.log('We are live on ' + port);
});	
	
	
	
	
	
	
	
	
	
//var server = http.createServer(function(req, res) {
//	
//	res.writeHead(200);
//	res.end('hello');
//  
//   
//});
//
//server.listen(8080);