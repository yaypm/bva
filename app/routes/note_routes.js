var request = require('request-promise');
var express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo')(session);


module.exports = function(app, db) {

	connectionOptions = process.env.MONGO_URI;

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());
	app.use(session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({url: connectionOptions}),
		cookie: { secure: false }
	}));

	function requiresLogin(req, res) {
  
		if (req.session && req.session.username) {
			return true;
		} 
		
		else {
			console.log("Not logged in user attempted access");
			return false;
		}
	}
	
	function generateId() {
		
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 16; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}	
	
	function checkAssessmentStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;
		
		MongoClient.connect(connectionOptions, function(err, db) {
			var collection = db.collection('user_assessments');
			collection.findOne({username:username, _id:bva_id}, function(err, result) {
				if (err) throw err;
					if(result != null) {
						res.sendFile(path.join(__dirname + '/workflow.html'));
						console.log(username + " is accessing " + bva_id);
					}
					else {
						res.redirect('/landing');
						console.log(username + " tried to access a bva they don't have access to: " + bva_id);
					}
				
					db.close();
			});
		})
	}
	
	app.get('/', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/index.html'));

	});
	
	app.get('/business', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/business.html'));

	});
	
	app.get('/development', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/development.html'));

	});
	
	app.get('/operations', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/operations.html'));

	});	
	
	app.get('/landing', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			res.sendFile(path.join(__dirname + '/landing.html'));
		}	
	});	

	app.get('/options', (req, res) => {

		res.sendFile(path.join(__dirname + '/options.html'));

	});	
	
	app.get('/workflow', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkAssessmentStatus(req, res);
		}

	});		
	
	app.post('/createUser', (req, res) => {	
		requiresLogin(req, res);
		var username = req.body.username;
		var passwd = generateId();
		
		bcrypt.hash(passwd, 10, function (err, hash){
    
			if (err) {
				
				return err;
    
			}

			passwd = hash;
			
			var user = {
				_id: req.body.username,
				password: passwd
			}
		
			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) { return console.dir(err); }

					var collection = db.collection('users');
					collection.insert(user, {w:1}, function(err, result) { 
					
						if(err!=null){
							console.log("could not insert " + username);   
							res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
							res.end("failure");
							db.close();
						}   
						
						else {					
							console.log("inserted " + username);   
							res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
							res.end("success");
							db.close();
						}	
					});	
			});
		});
	});
	
	app.post('/login', (req, res, next) => {	
		var username = req.body.username;
		var password = req.body.password;
		
		var user = {
			_id: req.body.username,
			password: req.body.password
		}
		
		
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();				
			}

			else {
				var collection = db.collection('users');
				var results = collection.find({_id:username}).toArray(function(err, items) {
					if(items[0] == undefined) {
						res.redirect('/?login=failed');
						db.close();
					}
					
					else {
					bcrypt.compare(password, items[0].password, function(err, result) {
					
						if (err) { 
							res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
							res.end("failure");
							db.close(); 
						}
						
						else {
							
							if(result == true) {
								req.session.username = username;
								req.session.save();
								console.log(req.session.username + " has logged in.");
								res.redirect('/landing');
								db.close();
							}
							else {
								res.redirect('/?login=failed');
								db.close();
							}
						}
					}) }
				});
			}	
		});
	});	
	
	app.post('/gimmePassword', (req, res) => {	
		pass = req.body.password;
	
		bcrypt.hash(pass, 10, function (err, hash){
    
			if (err) {
				
				return err;
    
			}
    
			password = hash;
			
			res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
			res.end(password);
		})
	});

	app.post('/createAssessment', (req, res) => {	
		var company = req.body.company;
		var business = req.body.business;
		var operations = req.body.operations;
		var development = req.body.development;
		var id = generateId();		
		
		var assessment = {
			_id: id,
			company: company,
			business: business,
			operations: operations,
			development: development			
		}
		
		var user_assessments = {
			_id: id,
			company: company,
			username: 'alistair.emslie@dynatrace.com'
		}
		
		var assessment_data = {
			_id: id,
			company_revenue: '',
			projected_growth: '',
			revenue_dependent: '',
			app_uptime: '',
			revenue_breach: '',
			incidents_month: '',
			no_ops_troubleshoot: '',
			no_dev_troubleshoot: '',
			mttr: '',
			no_apps_e2e: '',
			no_t1t2_apps: '',
			no_fte_existing: '',
			existing_apps: [],
			cycles_per_year: '',
			cycle_days: '',
			test_per_cycle: '',
			qa_time_per_cycle: '',
			qa_people_per_cycle: '',
			dev_time_per_cycle: '',
			dev_people_per_cycle: '',
			operation_cost: '55000',
			developer_cost: '56000',
			qa_cost: '46000',
			work_hours: '1950',
			benefit_incident_reduction: '30',
			benefit_mttr: '90',
			benefit_performance: '25',
			benefit_alert_storm: '88',
			benefit_sla: '75',
			benefit_fix_qa: '90',
			benefit_prod_reduction: '55',
			benefit_config: '97'
		}
		
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				var collection = db.collection('assessments');
				collection.insert(assessment, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in assessment");  });
				var collection = db.collection('user_assessments');
				collection.insert(user_assessments, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in user_assessments");      });
				var collection = db.collection('assessment_data');
				collection.insert(assessment_data, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in assessment_data");      });
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end("success");
				db.close();					
			}
		});	
	});	

	app.get('/getAssessmentList', (req, res) => {	

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}	

			var companyAssessment;
			
			var collection = db.collection('user_assessments');
			var results = collection.find({username:username}).toArray(function(err, items) {				
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(JSON.stringify(items));
				db.close();
			})		
		})	
	});	

	app.post('/updateAssessment', (req, res) => {	
		
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				var collection = db.collection('assessment_data');
				collection.update({'_id':req.header('bva_id')},{$set:{'company_revenue':req.body.company_revenue,'projected_growth':req.body.projected_growth,'revenue_dependent':req.body.revenue_dependent,'app_uptime':req.body.app_uptime,'revenue_breach':req.body.revenue_breach,'incidents_month':req.body.incidents_month,'no_ops_troubleshoot':req.body.no_ops_troubleshoot,'no_dev_troubleshoot':req.body.no_dev_troubleshoot,'mttr':req.body.mttr,'no_apps_e2e':req.body.no_apps_e2e,'no_t1t2_apps':req.body.no_t1t2_apps, 'no_fte_existing':req.body.no_fte_existing, 'cycles_per_year':req.body.cycles_per_year, 'cycle_days':req.body.cycle_days, 'test_per_cycle':req.body.test_per_cycle, 'qa_time_per_cycle':req.body.qa_time_per_cycle, 'qa_people_per_cycle': req.body.qa_people_per_cycle, 'dev_time_per_cycle':req.body.dev_time_per_cycle, 'dev_people_per_cycle':req.body.dev_people_per_cycle, 'operation_cost':req.body.operation_cost, 'developer_cost':req.body.developer_cost, 'qa_cost':req.body.qa_cost, 'work_hours':req.body.work_hours, 'benefit_incident_reduction':req.body.benefit_incident_reduction, 'benefit_mttr':req.body.benefit_mttr, 'benefit_performance':req.body.benefit_performance, 'benefit_alert_storm':req.body.benefit_alert_storm, 'benefit_sla':req.body.benefit_sla, 'benefit_fix_qa':req.body.benefit_fix_qa, 'benefit_prod_reduction': req.body.benefit_prod_reduction, 'benefit_config': req.body.benefit_config}});			

				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end("success");
				db.close();					
			}
		});			
	});		

	app.get('/getAssessmentData', (req, res) => {	

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}	
			
			var collection = db.collection('assessment_data');
			var results = collection.find({'_id':req.header('bva_id')}).toArray(function(err, items) {
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(JSON.stringify(items[0]));
				db.close();
			})		
		})	
	});		

};

