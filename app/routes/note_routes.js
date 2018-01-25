var request = require('request-promise');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

module.exports = function(app, db) {

	app.use(bodyParser.json());

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
		
		res.sendFile(path.join(__dirname + '/landing.html'));

	});	

	app.get('/options', (req, res) => {
		
		res.sendFile(path.join(__dirname + '/options.html'));

	});	
	
	app.get('/getOptions', (req, res) => {	
		var userId = req.header('userId');
		console.log(userId + " is getting options");
		
		//var resp = "test";
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('option');
			var results = collection.find({_id:userId}).toArray(function(err, items) {
			var resp = JSON.stringify(items[0]);
				
				console.log(userId + " received options");
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});
	
	app.post('/insertOptions', (req, res) => {
		var userId = req.body.userId;
		var it_downtime = req.body.it_downtime;
		var employee_productivity = req.body.employee_productivity;
		var incident_frequency = req.body.incident_frequency;
		var service_desk = req.body.service_desk;
		var sla_compliance = req.body.sla_compliance;
		var cloud_bill = req.body.cloud_bill;
		var speed_market = req.body.speed_market;
		
		var company_name = req.body.company_name;
		var study_period = req.body.study_period;
		var dynatrace_cost = req.body.dynatrace_cost;
		var competitive_analysis = req.body.competitive_analysis;
		
		console.log(userId + " is inserting options");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('option');
			
			collection.update({'_id':userId},{$set:{'it_downtime':it_downtime,'employee_productivity':employee_productivity,'incident_frequency':incident_frequency,'service_desk':service_desk,'sla_compliance':sla_compliance,'cloud_bill':cloud_bill,'speed_market':speed_market,'company_name':company_name,'study_period':study_period,'dynatrace_cost':dynatrace_cost,'competitive_analysis':competitive_analysis}});
		});
		console.log(userId + " inserted options");
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});
	
	app.post('/insertExpectedBenefits', (req, res) => {
		if(typeof req.body.userId !== undefined) {var userId = req.body.userId;}
		if(typeof req.body.dec_rev_incidents !== undefined) {var dec_rev_incidents = req.body.dec_rev_incidents;} else {var dec_rev_incidents = '';}
		if(typeof req.body.reduce_downtime !== undefined) {var reduce_downtime = req.body.reduce_downtime;} else {var reduce_downtime = '';}
		if(typeof req.body.increase_employee_prod !== undefined) {var increase_employee_prod = req.body.increase_employee_prod;} else {var increase_employee_prod = '';}
		if(typeof req.body.decrease_user_incidents !== undefined) {var decrease_user_incidents = req.body.decrease_user_incidents;} else {var decrease_user_incidents = '';}
		if(typeof req.body.reduce_incident_resolve !== undefined) {var reduce_incident_resolve = req.body.reduce_incident_resolve;} else {var reduce_incident_resolve = '';}
		if(typeof req.body.reduce_service_desk !== undefined) {var reduce_service_desk = req.body.reduce_service_desk;} else {var reduce_service_desk = '';}
		if(typeof req.body.reduce_sla_penalties !== undefined) {var reduce_sla_penalties = req.body.reduce_sla_penalties;} else {var reduce_sla_penalties = '';}
		if(typeof req.body.reduce_sla_resources !== undefined) {var reduce_sla_resources = req.body.reduce_sla_resources;} else {var reduce_sla_resources = '';}
		if(typeof req.body.reduce_cloud_bill !== undefined) {var reduce_cloud_bill = req.body.reduce_cloud_bill;} else {var reduce_cloud_bill = '';}
		if(typeof req.body.increase_time_market !== undefined) {var increase_time_market = req.body.increase_time_market;} else {var increase_time_market = '';}
		
		console.log(userId + " is inserting expected benefits");
			
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('expected_benefits');
			
			var fullJson = {'_id':userId,'dec_rev_incidents':dec_rev_incidents,'reduce_downtime':reduce_downtime,'increase_employee_prod':increase_employee_prod,'decrease_user_incidents':decrease_user_incidents,'reduce_incident_resolve':reduce_incident_resolve,'reduce_service_desk':reduce_service_desk,'reduce_sla_penalties':reduce_sla_penalties, 'reduce_sla_resources':reduce_sla_resources, 'reduce_cloud_bill':reduce_cloud_bill,'increase_time_market':increase_time_market};
			
			collection.find({_id:userId}).toArray(function(err, items) { 
		
				if(items[0] != undefined) {
					collection.update({'_id':userId},{$set:{'dec_rev_incidents':dec_rev_incidents,'reduce_downtime':reduce_downtime,'increase_employee_prod':increase_employee_prod,'decrease_user_incidents':decrease_user_incidents,'reduce_incident_resolve':reduce_incident_resolve,'reduce_service_desk':reduce_service_desk,'reduce_sla_penalties':reduce_sla_penalties,'reduce_sla_resources':reduce_sla_resources,'reduce_cloud_bill':reduce_cloud_bill,'increase_time_market':increase_time_market}});		
					console.log(userId + " updated expected benefits");
				} 
				
				else {
					collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted fresh expected benefits");    });								
				}
			});
			
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});

	app.get('/getExpectedBenefits', (req, res) => {	
		var userId = req.header('userId');
		console.log(userId + " is getting expected benefits");
		
		var resp = "test";
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('expected_benefits');
			var results = collection.find({_id:userId}).toArray(function(err, items) {
				var resp = JSON.stringify(items[0]);
				console.log(userId + " retrieved expected benefits");
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});	

	app.post('/insertGeneralDetails', (req, res) => {
		var userId = req.body.userId;
		if(typeof req.body.bus_days !== undefined) {var bus_days = req.body.bus_days;} else {var bus_days = '';}
		if(typeof req.body.npv !== undefined) {var npv = req.body.npv;} else {var npv = '';}		
		if(typeof req.body.avg_salary !== undefined) {var avg_salary = req.body.avg_salary;} else {var avg_salary = '';}
		if(typeof req.body.svc_desk_cost !== undefined) {var svc_desk_cost = req.body.svc_desk_cost;} else {var svc_desk_cost = '';}	
		if(typeof req.body.rev_growth !== undefined) {var rev_growth = req.body.rev_growth;} else {var rev_growth = '';}
		if(typeof req.body.confidence !== undefined) {var confidence = req.body.confidence;} else {var confidence = '';}			

		console.log(userId + " is inserting general details");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('general');
			
			var fullJson = {'_id':userId,'bus_days':bus_days,'npv':npv,'avg_salary':avg_salary,'svc_desk_cost':svc_desk_cost,'rev_growth':rev_growth,'confidence':confidence};
			
			collection.find({_id:userId}).toArray(function(err, items) { 
		
				if(items[0] != undefined) {
					collection.update({'_id':userId},{$set:{'bus_days':bus_days,'npv':npv,'avg_salary':avg_salary,'svc_desk_cost':svc_desk_cost,'rev_growth':rev_growth,'confidence':confidence}});		
					console.log(userId + " updated general details");		
				} 
				
				else {
					collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new general details");   });								
				}
			});
			
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});	
	
	app.get('/getGeneralDetails', (req, res) => {	
		var userId = req.header('userId');
		console.log(userId + " is getting general details");
		
		//var resp = "test";
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('general');
			var results = collection.find({_id:userId}).toArray(function(err, items) {
				var resp = JSON.stringify(items[0]);
				console.log(userId + " retrieved general details");
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});		

	app.post('/addApplication', (req, res) => {
		var userId = req.body.userId;
		var application_id = req.body.application_id;
		var application_name = req.body.application_name;
		var application_users = req.body.application_users;
		
		console.log(userId + " is adding an application");	

		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('applications');
			
			var fullJson = {'_id':application_id,'userId':userId,'application_name':application_name, 'application_users': application_users};
					
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted an application");    });										
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});	
	
	app.post('/deleteApplication', (req, res) => {
		var application_id = req.body.application_id;
		
		//console.log(userId + " is deleting an application");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('applications');
			
			collection.deleteOne( { _id: application_id } );
				
			//console.log(userId + " deleted an application");	
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});	

	app.get('/getApplications', (req, res) => {	
		var userId = req.header('userId');
		console.log(userId + " is getting applications");
		
		var jsonStr = '{"application":[]}';
		var obj = JSON.parse(jsonStr);
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('applications');
			var results = collection.find({'userId':userId}).toArray(function(err, items) {
				
				for(i=0; i < items.length; i++) {
					obj['application'].push({'id': items[i]._id, 'application_name':items[i].application_name, 'application_users':items[i].application_users})
				}
				
				console.log(userId + " retrieved applications");
				resp = JSON.stringify(obj);
				
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});	

	app.post('/insertProductCosts', (req, res) => {
		var userId = req.body._id;
		var obj = req.body;
		
		console.log(userId + " is inserting product costs");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('product_cost');
			
			collection.find({_id:userId}).toArray(function(err, items) { 
		
				if(items[0] != undefined) {
					
					for(i=0;i<obj.costs.length;i++) {
						var query = {};
						query["costs." + i + ".license_fees"] = obj.costs[i].license_fees;						
						query["costs." + i + ".maintenance"] = obj.costs[i].maintenance;	
						query["costs." + i + ".hardware"] = obj.costs[i].hardware;	
						query["costs." + i + ".implementation"] = obj.costs[i].implementation;	
						query["costs." + i + ".training"] = obj.costs[i].training;							
						
						collection.update({'_id':userId},{$set: query  });	
					}
					
					console.log(userId + " updated product costs");
				} 
				
				else {
					
					collection.insert(req.body, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new product costs");   });								
				}
			});			
													
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});	
	
	app.get('/getProductCosts', (req, res) => {	
		var userId = req.header('userId');
		var noYears = req.header('noYears');
		
		console.log(userId + " is getting product costs");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('product_cost');
			var results = collection.find({'_id':userId}).toArray(function(err, items) {
				//console.log(items);

				console.log(userId + " retrieved product costs");
				resp=JSON.stringify(items);
				
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});	

	app.post('/insertApplicationDetails', (req, res) => {
		var userId = req.body._id;
		var obj = req.body;
		
		console.log(userId + " is inserting application details");
		
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }
			
			var collection = db.collection('application_details');
			
			collection.find({_id:userId}).toArray(function(err, items) { 
				
				if(items[0] != undefined) {
					//console.log(items);
					
					var query = {};
					
					var keys = Object.keys(items[0]);
					
					for(i=1;i<keys.length;i++) {
					
						
						query[keys[i]] = {};
						if(typeof req.body.revincidents !== undefined) { query[keys[i]].revincidents = obj[keys[i]].revincidents; }
						if(typeof req.body.revperminute !== undefined) { query[keys[i]].revperminute = obj[keys[i]].revperminute; }
						if(typeof req.body.mttr !== undefined) { query[keys[i]].mttr = obj[keys[i]].mttr; }
						if(typeof req.body.numusers !== undefined) { query[keys[i]].numusers = obj[keys[i]].numusers; }
						if(typeof req.body.bustransperday !== undefined) { query[keys[i]].bustransperday = obj[keys[i]].bustransperday; }
						if(typeof req.body.busincidents !== undefined) { query[keys[i]].busincidents = obj[keys[i]].busincidents; }
						if(typeof req.body.bustransavgtime !== undefined) { query[keys[i]].bustransavgtime = obj[keys[i]].bustransavgtime; }
						if(typeof req.body.allincidents !== undefined) { query[keys[i]].allincidents = obj[keys[i]].allincidents; }
						if(typeof req.body.itstaffhours !== undefined) { query[keys[i]].itstaffhours = obj[keys[i]].itstaffhours; }
						if(typeof req.body.itstaffnum !== undefined) { query[keys[i]].itstaffnum = obj[keys[i]].itstaffnum; }
						if(typeof req.body.svcdeskpermonth !== undefined) { query[keys[i]].svcdeskpermonth = obj[keys[i]].svcdeskpermonth; }
						if(typeof req.body.currentslapenalties !== undefined) { query[keys[i]].currentslapenalties = obj[keys[i]].currentslapenalties; }
						if(typeof req.body.currenttimeslareport !== undefined) { query[keys[i]].currenttimeslareport = obj[keys[i]].currenttimeslareport; }
					}
					
					
					collection.update({'_id':userId},{$set: query  });			
						
						
					console.log(userId + " updated application details");
					
				} 
				
				else {
					
					collection.insert(req.body, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new application details");    });								
				}
			});			
													
		});
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end("success!");
		db.close();
	});	

	app.get('/getApplicationDetails', (req, res) => {	
		var userId = req.header('userId');
		
		console.log(userId + " is getting application details");
		
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva", function(err, db) {
			if(err) { return console.dir(err); }

			var collection = db.collection('application_details');
			var results = collection.find({'_id':userId}).toArray(function(err, items) {

				console.log(userId + " retrieved application details");
				resp=JSON.stringify(items);
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(resp);
				db.close();
			});
		});
	});	

	app.get('/createUser', (req, res) => {	
		var userId = req.header('userId');
		var newEmail = req.header('emailAddress');
		
		console.log(userId + " is being created");
		MongoClient.connect("mongodb://dtbva:ijustwannahaveabeerwithmymates@ds141274.mlab.com:41274/dtbva") 
		
		.then(function(db) {
			//if(err) { return console.dir(err); }

			//create user
			var collection = db.collection('user');
			var fullJson = ({'_id':userId,'email':newEmail});			
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new user table");    });

			//create options
			var collection = db.collection('option');
			var fullJson = {'_id':userId,'it_downtime':true,'employee_productivity':true,'incident_frequency':true,'service_desk':true,'sla_compliance':true,'cloud_bill':true,'speed_market':true,'company_name':'','study_period':3,'dynatrace_cost':true,'competitive_analysis':true};
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new options table");    });
			
			//create expected benefits
			var collection = db.collection('expected_benefits');
			var fullJson = {'_id':userId,'dec_rev_incidents':'','reduce_downtime':'','increase_employee_prod':'','decrease_user_incidents':'','reduce_incident_resolve':'','reduce_service_desk':'','reduce_sla_penalties':'', 'reduce_sla_resources':'','reduce_cloud_bill':'','increase_time_market':''};
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new expected benefits table");    });
			
			//create general
			var collection = db.collection('general');
			var fullJson = {'_id':userId,'bus_days':'','npv':'','avg_salary':'','svc_desk_cost':'','rev_growth':'','confidence':'70'};
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new general table");    });
			
			//create empty product costs
			var collection = db.collection('product_cost');
			var fullJson = {"_id": userId,"costs": [{"license_fees": "","maintenance": "","hardware": "","implementation": "","training": ""},{"license_fees": "","maintenance": "","hardware": "","implementation": "","training": ""},{"license_fees": "","maintenance": "","hardware": "","implementation": "","training": ""},{"license_fees": "","maintenance": "","hardware": "","implementation": "","training": ""},{"license_fees": "","maintenance": "","hardware": "","implementation": "","training": ""}]};
			collection.insert(fullJson, {w:1}, function(err, result) { if(err!=null){console.log(err);}     console.log(userId + " inserted new product cost table");    });
		})
			
		.then(function () {
				console.log(userId + " was created");
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end(userId);
				db.close();				
		})
		
		.catch(function (err) {})
	});
	
};