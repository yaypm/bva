var request = require('request-promise');
var express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');


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
			collection.findOne({username:username, id:bva_id}, function(err, result) {
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

	function checkEditStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;
		
		console.log(username);
		console.log(bva_id);
		
		MongoClient.connect(connectionOptions, function(err, db) {
			var collection = db.collection('user_assessments');
			collection.findOne({username:username, id:bva_id}, function(err, result) {
				if (err) throw err;
					if(result != null) {
						res.sendFile(path.join(__dirname + '/edit.html'));
					}
					else {
						res.redirect('/landing');
					}
				
					db.close();
			});
		})
	}

	function checkShareStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;
		console.log(bva_id);
		MongoClient.connect(connectionOptions, function(err, db) {
			var collection = db.collection('user_assessments');
			collection.findOne({username:username, id:bva_id}, function(err, result) {
				if (err) throw err;
					if(result != null) {
						res.sendFile(path.join(__dirname + '/share.html'));
					}
					else {
						res.redirect('/landing');
					}
				
					db.close();
			});
		})
	}
	
	function sendMail(email, subject, text, html) {
		nodemailer.createTestAccount((err, account) => {
		
		var transporter = nodemailer.createTransport({
			host: 'smtp.office365.com', 
			port: 587,     
			secure: false, 
			requireTLS: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			},
			tls: {
				ciphers: 'SSLv3'
			}
		});	

		let mailOptions = {
			from: '"Dynatrace Business Value Assessment" <alistair.emslie@dynatrace.com>', 
			to: email, 
			subject: subject, 
			text: text, 
			html: html 
		};	

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	
		});	
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
	
	app.get('/reset', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/reset.html'));

	});	

	app.get('/signup', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/signup.html'));

	});		
	
	app.get('/changepassword', (req, res) => {
		
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			res.sendFile(path.join(__dirname + '/changepassword.html'));
		}	

	});		

	app.get('/createnew', (req, res) => {
		
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			res.sendFile(path.join(__dirname + '/createnew.html'));
		}	

	});	
	
	app.get('/resetpassword', (req, res) => {
		var token = req.query.token;

		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}	
			
			else { 
				var collection = db.collection('user_reset');
				var results = collection.find({reset:token}).toArray(function(err, items) {				
					res.sendFile(path.join(__dirname + '/resetpassword.html'));
					db.close();
				})
			}
		})	

	});	

	app.post('/resetyourpassword', (req, res) => {
		var password = req.body.password;
		var token = req.query.token;
		var dat = new Date();
		
		if(password == "") {
			res.redirect('/resetpassword?token=' + token + '&status=failed');
		}
		
		else {
		bcrypt.hash(password, 10, function (err, hash){
		
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.redirect('/resetpassword?token=' + token + '&status=failed');
				db.close();				
			}	
			
			else { 
	
				var collection = db.collection('user_reset');
				var results = collection.find({reset:token}).toArray(function(err, items) {
					
					if(items != null) {
						if(dat < items[0].expiry) {
							var username = items[0].username;
							var collection = db.collection('users');
							collection.update({'_id':username},{$set:{'password':hash}});
							
							var collection = db.collection('user_reset');
							collection.remove({reset: token}, function(err, result) {
								res.redirect('/resetpassword?status=success');
							})
						}
					}
					else {
						res.redirect('/resetpassword?token=' + token + '&status=failed');
					}
				})		
			}
		})	
		
		})
		
		}
	});		

	app.post('/changeyourpassword', (req, res) => {
		var currentpassword = req.body.currentpassword;
		var newpassword = req.body.newpassword;
		var newpasswordconfirm = req.body.newpasswordconfirm;
		var username = req.session.username;
		
		if(currentpassword == "" || newpassword == "" || newpasswordconfirm == "" || newpassword != newpasswordconfirm) {
			res.redirect('/changepassword?status=failed');
		}
		
		else {
		MongoClient.connect(connectionOptions, function(err, db) {	
				var collection = db.collection('users');
				var results = collection.find({_id:username}).toArray(function(err, items) {
					if(items[0] == undefined) {
						res.redirect('/changepassword?status=failed');
						db.close();
					}
					
					else {
					bcrypt.compare(currentpassword, items[0].password, function(err, result) {
					
						if (err) { 
							res.redirect('/changepassword?status=failed');
							db.close();
						}
						
						else {
							
							if(result == true) {
								bcrypt.hash(newpassword, 10, function (err, hash){
									var collection = db.collection('users');
									collection.update({'_id':username},{$set:{'password':hash}});
									res.redirect('/changepassword?status=success');
									db.close();
								})
							}
							else {
								res.redirect('/changepassword?status=failed');
								db.close();
							}
						}
					}) 
					}
				});
			})
		}
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

	app.get('/edit', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkEditStatus(req, res);
		}

	});	

	app.get('/share', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkShareStatus(req, res);
		}

	});		
	
	app.post('/createUser', (req, res) => {	
		//requiresLogin(req, res);
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var username = req.body.username;
		var passwd = generateId();

		var results = new RegExp('(@dynatrace.com)').exec(username);
		
		if(results != undefined) {
			var status = "dynatrace";
		}
		
		else {
			var status = "customer";
		}
		
		bcrypt.hash(passwd, 10, function (err, hash){
    
			if (err) {
				
				return err;
    
			}

			hashPw = hash;
			
			var user = {
				_id: req.body.username,
				firstName: firstName,
				lastName: lastName,
				status: status,
				password: hashPw
			}
		
			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) { return console.dir(err); }

					var collection = db.collection('users');
					collection.insert(user, {w:1}, function(err, result) { 
					
						if(err!=null){
							console.log("could not insert " + username);   
							res.redirect('/signup?status=failed');
							db.close();
						}   
						
						else {					
							console.log("inserted " + username);   
							res.redirect('/signup?status=success');
							db.close();
							
							var email = username;
							var subject = "Your new account"
							var text = "";
							var html = "Dear " + firstName + ", <br /><br /> Your temporary password is: " + passwd + "<br /><br />Please login to change it as soon as possible! <br /><br /> <a href='https://dynatrace.ai/bva'>https://dynatrace.ai/ba</a><br /><br />Many thanks, <br /><br />Dynatrace";
							
							sendMail(email, subject, text, html);
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
								res.redirect('/?status=failed');
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
		var id = generateId();		
		
		if(company == ""){
			res.redirect('/createnew?status=failed');	
		}
		
	else {
		var assessment = {
			_id: id,
			company: company			
		}
		
		var user_assessments = {
			id: id,
			company: company,
			username: req.session.username
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
				res.redirect('/createnew?status=failed');
				db.close();					
			}

			else {
				var collection = db.collection('assessments');
				collection.insert(assessment, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in assessment");  });
				var collection = db.collection('user_assessments');
				collection.insert(user_assessments, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in user_assessments");      });
				var collection = db.collection('assessment_data');
				collection.insert(assessment_data, {w:1}, function(err, result) { if(err!=null){console.log(err);}  console.log("added in assessment_data");      });
				
				res.redirect('/workflow?bva_id=' + id);
				db.close();				
			}
		});	
	}
	
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

	app.get('/getAssessmentMetaData', (req, res) => {	

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}	
			
			var collection = db.collection('assessments');
			var results = collection.find({'_id':req.header('bva_id')}).toArray(function(err, items) {
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(JSON.stringify(items[0]));
				db.close();
			})		
		})	
	});		
	
	app.get('/getUserDetails', (req, res) => {	

		var theUsername = req.session.username;

		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}	
			
			var collection = db.collection('user_assessments');
			var results = collection.find({'id':req.header('bva_id')}).toArray(function(err, items) {
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				userDetails = {
					company: items[0].company,
					username: theUsername
				}
				//console.log(JSON.stringify(userDetails));
				res.end(JSON.stringify(userDetails));
				db.close();
			})		
		})	
	});	

	app.post('/addExistingTool', (req, res) => {	
		
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				var collection = db.collection('assessment_data');
				collection.update({'_id':req.header('bva_id')},{$push:{'existing_apps':{"tool_id": req.body.tool_id, "name": req.body.name_tool, "annual_costs": req.body.annual_cost, "ftes":req.body.no_fte_config, "y1":req.body.existing_y1, "y2": req.body.existing_y2, "y3": req.body.existing_y3} }});			
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end("success");
				db.close();					
			}
		});			
	});		

	app.post('/deleteExistingTool', (req, res) => {	
		
		var id = req.body.id;
		
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				//console.log(id);
				var collection = db.collection('assessment_data');
				collection.update({'_id':req.header('bva_id')},{$pull:{'existing_apps':{"tool_id": id} }});			
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end("success");
				db.close();					
			}
		});			
	});		

	app.post('/reset', (req, res, next) => {	
		var username = req.body.username;
		var resetLink = generateId();
		
		var dat = new Date();
		var dat = dat.setDate(dat.getDate() + 1);
				
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.redirect('/reset?status=failed');
				db.close();				
			}

			else {
				var collection = db.collection('users');
				var results = collection.find({_id:username}).toArray(function(err, items) {
					if(items[0] == undefined) {
						res.redirect('/reset?status=failed');
						db.close();
					}
					
					else {
						var resetRecord = {
							username: username,
							reset: resetLink,
							expiry: dat
						}
						
						var collection = db.collection('user_reset');
						collection.insert(resetRecord, {w:1}, function(err, result) { 
							if(err!=null){
								console.log(err);
								res.redirect('/reset?status=failed');
							}    
						});
						
						
						console.log(items[0].firstName);
						var email = username;
						var subject = "Reset your password"
						var text = "";
						var html = "Dear " + items[0].firstName + ", <br /><br />Please use this link to reset your password: <a href='https://bva.herokuapp.com/resetpassword?token=" + resetLink + "'>https://bva.herokuapp.com/resetpassword?token=" + resetLink + "</a><br /><br />Many thanks,<br /><br />Dynatrace";
							
						sendMail(email, subject, text, html);
						
						res.redirect('/reset?status=success');
						db.close(); 
					}
				});
			}	
		});
	});

	app.post('/sharebva', (req, res) => {	
		var id = req.query.bva_id;
		var username = req.session.username;
		var username_share = req.body.username_share;
		
		if(username_share == "" || id == "") {
			res.redirect('/share?status=failed');
		}
		
		else {
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				var collection = db.collection('user_assessments');
				var results = collection.find({id:id, username:username}).toArray(function(err, items) {	
					if(err) {
						console.log(err);
						res.redirect('/share?bva_id=' + id + "&status=failed");
					}
					else {
						console.log(items);
						var company = items[0].company;
	
						var newShare = {
							id:id,
							company: company,
							username: username_share
						}

						var collection = db.collection('user_assessments');
						collection.insert(newShare, {w:1}, function(err, result) { 						
							if(err!=null){
								console.log(err);
								res.redirect('/share?bva_id=' + id + "&status=failed");
							}    
							else {
								var email = username_share;
								var subject = "You have a new assessment!"
								var text = "";
								var html = "Hello,<br /><br />You have a new assessment that has been shared by " + username + ", titled \"" + company + ".\"<br /><br />Please access this at <a href='https://www.dynatrace.ai/bva'>https://www.dynatrace.ai/bva</a><br /><br />Many thanks,<br /><br />Dynatrace";
							
								sendMail(email, subject, text, html);
								
								res.redirect('/share?bva_id=' + id + "&status=success");
							}
						});
					}
				})
			}
		});	

		}	
	});		

	app.post('/editbva', (req, res) => {	
		var id = req.query.bva_id;
		var username = req.session.username;
		var company = req.body.company;
		
		if(id == "") {
			res.redirect('/edit?status=failed');
		}
		
		else {
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) { 
				return console.dir(err); 
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();				
			}

			else {
				var collection = db.collection('user_assessments');
				var results = collection.find({id:id, username:username}).toArray(function(err, items) {	
					if(err) {
						console.log(err);
						res.redirect('/edit?bva_id=' + id + "&status=failed");
					}
					else {
						var collection = db.collection('assessments');
						collection.update({'_id':id},{$set:{'company':company}});
						
						var collection = db.collection('user_assessments');
						collection.update({'id':id},{$set:{'company':company}});
						
						res.redirect('/edit?bva_id=' + id + "&status=success");
					}
				})
			}
		});	

		}	
	});			
};

	

