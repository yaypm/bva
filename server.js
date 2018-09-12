try {
  require('@dynatrace/oneagent')({
      environmentid: process.env.TENANT_ID,
      apitoken: process.env.API_KEY,
  });
} catch(err) {
  console.log(err.toString());
}

var Promise = require('es6-promise').Promise;

var http = require('http');
var https = require('https');
var request = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');	
var app = express();

var port = 8080;

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: true }));	
require('./app/routes')(app, {});	

app.listen(process.env.PORT, () => {
console.log('We are live on ' + process.env.PORT);
});	