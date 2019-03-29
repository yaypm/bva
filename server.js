//try {
//  require('@dynatrace/oneagent')({
//      environmentid: process.env.TENANT_ID,
//      apitoken: process.env.API_KEY,
//  });
//} catch(err) {
//  console.log(err.toString());
//}

var Promise = require('es6-promise').Promise;

var http = require('http');
var https = require('https');
var request = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');	
var app = express();

var port;

if(process.env.PORT == undefined) {
    port = 8080;
}
else {
    port = process.env.PORT;
}

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: true }));	
require('./app/routes')(app, {});	


app.listen(port, () => {
    console.log('We are live on ' + port);
});	