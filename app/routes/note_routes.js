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

	function validateEmail(mail) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)) {
			return (true)
		}

		return (false)
	}

	function checkAssessmentStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;

		if(bva_id == ""){
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('user_assessments');
				collection.findOne({username:username, id:bva_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/workflow.html'));
						}
						else {
							var check = new RegExp('(@dynatrace.com)').exec(username);
							if(check == null) {
								db.close();
								res.redirect('/landing');
								console.log(username + " tried to access a bva they don't have access to: " + bva_id);
							}
							else {
								db.close();
								res.sendFile(path.join(__dirname + '/workflow_readonly.html'));
							}
						}
				});
			})
		}
	}

	function checkSEAssessmentStatus(req, res) {
		var username = req.session.username;
		var se_id = req.query.se_id;

		if(se_id == ""){
			console.log("no se id");
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('se_user_assessments');
				collection.findOne({username:username, id:se_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/workflow_se.html'));
						}
						else {
							var check = new RegExp('(@dynatrace.com)').exec(username);
							if(check == null) {
								db.close();
								console.log("no results");
								res.redirect('/landing');
							}
							else {
								db.close();
								res.sendFile(path.join(__dirname + '/workflow_se_readonly.html'));
							}

						}
				});
			})
		}
	}

	function checkReportStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;

		if(bva_id == ""){
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('user_assessments');
				collection.findOne({username:username, id:bva_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/report.html'));
						}
						else {
							db.close();
							res.redirect('/landing');
							console.log(username + " tried to access a bva they don't have access to: " + bva_id);
						}
				});
			})
		}
	}

	function checkEditStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;

		if(username == "" || bva_id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('user_assessments');
				collection.findOne({username:username, id:bva_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/edit.html'));
						}
						else {
							db.close();
							res.redirect('/landing');
						}
				});
			})
		}
	}

	function checkSeEditStatus(req, res) {
		var username = req.session.username;
		var se_id = req.query.se_id;

		if(username == "" || se_id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('se_user_assessments');
				collection.findOne({username:username, id:se_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/edit_se.html'));
						}
						else {
							db.close();
							res.redirect('/landing');
						}
				});
			})
		}
	}

	function checkShareStatus(req, res) {
		var username = req.session.username;
		var bva_id = req.query.bva_id;

		if(username == "" || bva_id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('user_assessments');
				collection.findOne({username:username, id:bva_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) {
						console.log(err);
						res.redirect('/share?bva_id=' + bva_id + '&staus=failed');
					}

					else {
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/share.html'));
						}

						else {
							db.close();
							res.redirect('/landing');
						}
					}
				});
			})
		}
	}

	function checkSeShareStatus(req, res) {
		var username = req.session.username;
		var se_id = req.query.se_id;

		if(username == "" || se_id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('se_user_assessments');
				collection.findOne({username:username, id:se_id}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) {
						console.log(err);
						res.redirect('/share_se?se_id=' + se_id + '&staus=failed');
					}

					else {
						if(result != null) {
							db.close();
							res.sendFile(path.join(__dirname + '/share_se.html'));
						}

						else {
							db.close();
							res.redirect('/landing');
						}
					}
				});
			})
		}
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

	if (requiresLogin(req, res) == false) {
		res.sendFile(path.join(__dirname + '/index.html'));
	}
	else {
		res.redirect('/landing');
	}

	});
	
	app.get('/test', (req, res) => {

	 res.sendFile(path.join(__dirname + '/test.html'));


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

	app.get('/createnew_se', (req, res) => {

		if (requiresLogin(req, res) == false) {
			console.log("apparently not logged in");
			res.redirect('/');
		}
		else {
			var username = req.session.username;
			if(username == ""){
				console.log("apparently no username");
				res.redirect('/landing');
			}

			else {
				MongoClient.connect(connectionOptions, function(err, db) {
					var collection = db.collection('se');
					collection.findOne({"email":username}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
						if (err) throw err;
							if(result == null) {
								db.close();
								console.log("apparently no results");
								res.redirect('/landing');
							}
							else {
								db.close();
								res.sendFile(path.join(__dirname + '/createnew_se.html'));
								//console.log(username + " tried to access a bva they don't have access to: " + bva_id);
							}
					});
				})
			}
		}

	});

	app.get('/editassessment', (req, res) => {

		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			var results = new RegExp('(@dynatrace.com)').exec(req.session.username);

			if(results != undefined) {
				res.sendFile(path.join(__dirname + '/editassessment.html'));
			}
			else {
				res.redirect('/landing');
			}
		}

	});

	app.get('/search_se', (req, res) => {

		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			var results = new RegExp('(@dynatrace.com)').exec(req.session.username);

			if(results != undefined) {
				res.sendFile(path.join(__dirname + '/search_se.html'));
			}
			else {
				res.redirect('/landing');
			}
		}

	});

	app.get('/resetpassword', (req, res) => {
		var token = req.query.token;

		if(token == "") {
			res.redirect('/');
		}

		else {

			MongoClient.connect(connectionOptions, function(err, db) {

				if(err) {
					console.log(err);
					db.close();
					res.redirect('/');
				}

				else {
					var collection = db.collection('user_reset');
					var results = collection.find({reset:token}).toArray(function(err, items) {
						if(items[0] == undefined) {
							db.close();
							res.redirect('/');
						}
						else {
							db.close();
							res.sendFile(path.join(__dirname + '/resetpassword.html'));
						}
					})
				}
			})
		}
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
						console.log(err);
						db.close();
						res.redirect('/resetpassword?token=' + token + '&status=failed');
					}

					else {

						var collection = db.collection('user_reset');
						var results = collection.find({reset:token}).toArray(function(err, items) {

							if(err){
								db.close();
								res.redirect('/resetpassword?token=' + token + '&status=failed');
							}

							if(items != null) {
								if(dat < items[0].expiry) {
									var username = items[0].username;
									var collection = db.collection('users');
									collection.update({'_id':username},{$set:{'password':hash}},{collation:{ locale: "en", strength: 2 }});

									var collection = db.collection('user_reset');
									collection.remove({reset: token}, function(err, result) {
										db.close();
										res.redirect('/resetpassword?status=success');
									})
								}
							}

							else {
								db.close();
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
				var results = collection.find({_id:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(items[0] == undefined) {
						db.close();
						res.redirect('/changepassword?status=failed');
					}

					else {
						bcrypt.compare(currentpassword, items[0].password, function(err, result) {

							if (err) {
								db.close();
								res.redirect('/changepassword?status=failed');
							}

							else {

								if(result == true) {
									bcrypt.hash(newpassword, 10, function (err, hash){
										var collection = db.collection('users');
										collection.update({'_id':username}, {$set:{'password':hash}}, {collation:{ locale: "en", strength: 2 }});
										db.close();
										res.redirect('/changepassword?status=success');
									})
								}
								else {
									db.close();
									res.redirect('/changepassword?status=failed');
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
			var results = new RegExp('(@dynatrace.com)').exec(req.session.username);

			if(results != undefined) {
				res.sendFile(path.join(__dirname + '/landing_admin.html'));
			}

			else {
				res.sendFile(path.join(__dirname + '/landing.html'));
			}
		}
	});

	app.get('/landing', (req, res) => {

		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			var username = req.session.username;
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('se');
				collection.findOne({"email":username}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result == null) {
							db.close();
							res.redirect('/');
						}
						else {
							db.close();
							res.sendFile(path.join(__dirname + '/landing.html'));
						}
					});
				})
		}
	});

	app.get('/workflow', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkAssessmentStatus(req, res);
		}

	});

	app.get('/workflow_se', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkSEAssessmentStatus(req, res);
		}

	});

	app.get('/report', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkReportStatus(req, res);
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

	app.get('/edit_se', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkSeEditStatus(req, res);
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

	app.get('/share_se', (req, res) => {
		if (requiresLogin(req, res) == false) {
			res.redirect('/');
		}
		else {
			checkSeShareStatus(req, res);
		}

	});

	app.post('/createUser', (req, res) => {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var username = req.body.username;
		var passwd = generateId();

		if(firstName == "" || lastName == "" || username == "" || validateEmail(username) == false) {
			res.redirect('/signup?status=failed');
		}

		else {

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
								db.close();
								res.redirect('/signup?status=failed');
							}

							else {
								var email = username;
								var subject = "Your new account"
								var text = "";
								var html = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\"><html style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"> <title></title> <style>@media only screen and (max-width: 580px){body{font-size: 16px !important;}table.container{width: 100% !important;}.button{font-size: 16px !important; line-height: 24px !important; border-top: 10px solid #00a1b2 !important; border-bottom: 10px solid #00a1b2 !important; border-right: 26px solid #00a1b2 !important; border-left: 26px solid #00a1b2 !important;}.cta-button{background-color: #7dc540 !important; border-top: 8px solid #7dc540 !important; border-bottom: 8px solid #7dc540 !important; border-right: 60px solid #7dc540 !important; border-left: 60px solid #7dc540 !important;}}</style> </head> <body style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <table class=\"body\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; padding: 0; border: 0; background-color: #ececec; border-collapse: collapse; margin: 0 auto; height: 100%; width: 100%!important;\" height=\"100%\" bgcolor=\"#ececec\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td align=\"center\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"container\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"580\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; border-collapse: collapse; width: 580px;\" bgcolor=\"#ffffff\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"header\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #242424; border-collapse: collapse; color: #ffffff; width: 100%!important;\" bgcolor=\"#242424\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px 30px;\" valign=\"top\"><img src=\"http://assets.dynatrace.com/global/logos/dynatrace_web-224x40.png\" alt=\"Dynatrace Logo\" style=\"display: block; max-width: 100%; height: 30px; margin: 0;\" height=\"30\"></td></tr></table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"content\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; width: 100%;\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"section\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; width: 100%!important;\" bgcolor=\"#ffffff\"><tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 40px 30px 60px;\" valign=\"top\"><h1 id=\"your-new-account\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; margin-bottom: 15px;\">Your new account</h1><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Hi " + firstName + ",</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Thank you for creating an account for your business value assessment.</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Your temporary password is: <b>" + passwd + "</b></p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Please login <a href=\"http://dynatrace.ai/bva\" style=\"color: #00a1b2; text-decoration: none;\">here</a> to change it as soon as possible! </p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Many thanks,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">The BVA (Business Value Assessment) team</p></td></tr></tbody></table> </td></tr></tbody> </table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"footer\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #353535; color: #ffffff; font-size: 12px; text-align: center; width: 100%!important;\" bgcolor=\"#353535\" align=\"center\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px;\" valign=\"top\"> <p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px; color: #ffffff;\">© 2018 Dynatrace LLC. All Rights Reserved<br><a href=\"https://www.dynatrace.com/\" style=\"color: #ffffff; text-decoration: underline;\">dynatrace.com</a></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>";

								sendMail(email, subject, text, html);
								console.log("inserted " + username);
								db.close();
								res.redirect('/signup?status=success');
							}
						});
				});
			});
		}
	});

	app.post('/login', (req, res, next) => {
		var username = req.body.username;
		var password = req.body.password;

		var user = {
			_id: req.body.username,
			password: req.body.password
		}

			if(validateEmail(username) == false) {
				res.redirect('/?status=failed');
			}

			else {

				MongoClient.connect(connectionOptions, function(err, db) {
					if(err) {
						console.log(err);
						db.close();
						res.redirect('/?status=failed');
					}

					else {
						var collection = db.collection('users');
						var results = collection.find({_id:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
							if(items[0] == undefined) {
								db.close();
								res.redirect('/?status=failed');
							}

							else {
							bcrypt.compare(password, items[0].password, function(err, result) {

								if (err) {
									db.close();
									res.redirect('/?status=failed');
								}

								else {

									if(result == true) {
										db.close();
										req.session.username = username;
										req.session.save();
										console.log(req.session.username + " has logged in.");
										res.redirect('/landing');
									}
									else {
										db.close();
										res.redirect('/?status=failed');
									}
								}
							}) }
						});
					}
				});
			}

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
	
	app.get('/testing', (req, res) => {
		
		var iops = Math.floor((Math.random() * 250) + 200);
		var volume_latency = Math.floor((Math.random() * 20) + 10);
		var usage_array = [50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70];
		var usage = usage_array[Math.floor((Math.random() * 20) + 1)];
		
		var results = {"iops": iops, "volume_latency": volume_latency,  "usage": usage };
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end(JSON.stringify(results));
		
	});
	
	app.post('/v1/tokens', (req, res) => {
		
		var results = {"data": {"session_token": "0123456789"}};
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end(JSON.stringify(results));
		
	});
	
	app.get('/v1/volumes', (req, res) => {
		
		var results = { "data": [ { "id": "060df0fe6f7dc7bb160000000000000000000001be", "name": "myvol1" } ], "endRow": 1, "startRow": 0, "totalRows": 1 };
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end(JSON.stringify(results));
		
	});	

	app.get('/v1/volumes/060df0fe6f7dc7bb160000000000000000000001be', (req, res) => {
		
		var results = {
   data: {
      access_control_records: [
         {
            access_protocol: "iscsi",
            acl_id: "0d00000000000004d3000000000000000000000001",
            apply_to: "both",
            chap_user_id: "",
            chap_user_name: "*",
            initiator_group_id: "",
            initiator_group_name: "*",
            lun: 0
         }
      ],
      agent_type: "none",
      app_uuid: "",
      base_snap_id: "",
      base_snap_name: "",
      block_size: 4096,
      cache_needed_for_pin: 104857600,
      cache_pinned: false,
      cache_policy: "normal",
      caching_enabled: true,
      clone: false,
      creation_time: 1430516996,
      description: "",
      dest_pool_id: "",
      dest_pool_name: "",
      encryption_cipher: "none",
      fc_sessions: null,
      full_name: "",
      id: "0600000000000004d3000000000000000000000001",
      iscsi_sessions: null,
      last_modified: 1430516996,
      limit: 100,
      metadata: null,
      move_aborting: false,
      move_bytes_migrated: 0,
      move_bytes_remaining: 0,
      move_start_time: 0,
      multi_initiator: false,
      name: "myvol1",
      num_connections: 0,
      num_fc_connections: 0,
      num_iscsi_connections: 0,
      num_snaps: 0,
      offline_reason: null,
      online: true,
      online_snaps: null,
      owned_by_group: "g1a1",
      parent_vol_id: "",
      parent_vol_name: "",
      perfpolicy_id: "0300000000000004d3000000000000000000000001",
      perfpolicy_name: "default",
      pinned_cache_size: 0,
      pool_id: "0a00000000000004d3000000000000000000000001",
      pool_name: "default",
      projected_num_snaps: 0,
      read_only: false,
      reserve: 0,
      search_name: "myvol1",
      serial_number: "9965f28016895f826c9ce900d3040000",
      size: 100,
      snap_limit: 9223372036854776000,
      snap_reserve: 0,
      snap_usage_compressed_bytes: 0,
      snap_usage_populated_bytes: 0,
      snap_usage_uncompressed_bytes: 0,
      snap_warn_level: 0,
      target_name: "iqn.2007-11.com.nimblestorage:myvol1-v00000000000004d3.00000001.000004d3",
      thinly_provisioned: true,
      upstream_cache_pinned: false,
      usage_valid: true,
      vol_state: "online",
      vol_usage_compressed_bytes: 0,
      vol_usage_uncompressed_bytes: 0,
      volcoll_id: "",
      volcoll_name: "",
      warn_level: 80
   }
};
		
		res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
		res.end(JSON.stringify(results));
		
	});		
	
	app.post('/createAssessment', (req, res) => {

		var company = req.body.company;
		var currency = req.body.currency;
		var id = generateId();

		if(company == ""){
			res.redirect('/createnew?status=failed');
		}

		else {
			var assessment = {
				_id: id,
				company: company,
				has_pricing: false,
				sfdc: "",
				currency: currency
			}

			var user_assessments = {
				id: id,
				company: company,
				username: req.session.username
			}

			if(currency == "uk") { var operations = '34000'; var developers = '39000'; var qas = '25000'; }
			if(currency == "ireland") { var operations = '40000'; var developers = '41000'; var qas = '33000'; }
			if(currency == "us") { var operations = '64000'; var developers = '79000'; var qas = '60000'; }
			if(currency == "france") { var operations = '40000'; var developers = '44000'; var qas = '50000'; }
			if(currency == "benelux") { var operations = '48000'; var developers = '48000'; var qas = '48000'; }
			if(currency == "germany") { var operations = '48000'; var developers = '50000'; var qas = '58000'; }
			if(currency == "spain") { var operations = '22000'; var developers = '25000'; var qas = '33000'; }
			if(currency == "italy") { var operations = '24000'; var developers = '25000'; var qas = '30000'; }



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
				operation_cost: operations,
				developer_cost: developers,
				qa_cost: qas,
				work_hours: '1950',
				benefit_conversion: '0.01',
				benefit_incident_reduction: '30',
				benefit_mttr: '90',
				benefit_sla: '75',
				benefit_fix_qa: '90',
				benefit_prod_reduction: '55',
				benefit_config: '97',
				y1_software: '',
				y1_services: '',
				y2_software: '',
				y2_services: '',
				y3_software: '',
				y3_services: ''
			}

			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) {
					db.close();
					console.log(err);
					res.redirect('/createnew?status=failed');
				}

				else {
					var collection = db.collection('assessments');
					collection.insert(assessment, {w:1}, function(err, result) { if(err!=null){console.log(err);}   });
					var collection = db.collection('user_assessments');
					collection.insert(user_assessments, {w:1}, function(err, result) { if(err!=null){console.log(err);}   });
					var collection = db.collection('assessment_data');
					collection.insert(assessment_data, {w:1}, function(err, result) { if(err!=null){console.log(err);}        });

					res.redirect('/workflow?bva_id=' + id);
					db.close();
				}
			});
		}

	});

	app.post('/createSeAssessment', (req, res) => {

		var company = req.body.company;
		if(req.body.seBvaSearch == undefined) {
				var seBvaSearch = '';
		}
		else {
				var seBvaSearch = req.body.seBvaSearch;
		}
		var id = generateId();

		if(company == ""){
			res.redirect('/createnew?status=failed');
		}

		else {
			var se_assessments = {
				_id: id,
				company: company,
				bva_id: seBvaSearch
			}

			var se_user_assessments = {
				id: id,
				company: company,
				username: req.session.username
			}

			var se_assessment_data = {
				_id: id,
				company: company,
				trends: 0,
				trends_prio: "low",
				causation: 0,
				causation_prio: "low",
				outcomes_appowner_feedback: "",
				digital: 0,
				digital_prio: "low",
				bi: 0,
				bi_prio: "low",
				market: 0,
				market_prio: "low",
				outcomes_cxo_feedback: "",
				driving: 0,
				driving_prio: "low",
				healing: 0,
				healing_prio: "low",
				culture: 0,
				culture_prio: "low",
				automation: 0,
				automation_prio: "low",
				bill: 0,
				bill_prio: "low",
				autonomous_appowner_feedback: "",
				tool_cons: 0,
				tool_cons_prio: "low",
				devops: 0,
				devops_prio: "low",
				ai: 0,
				ai_prio: "low",
				integrations: 0,
				integrations_prio: "low",
				fullstack_ops_feedback: "",
				release: 0,
				release_prio: "low",
				lifecycle: 0,
				lifecycle_prio: "low",
				shift: 0,
				shift_prio: "low",
				fullstack_dev_feedback: "",
				perfect: 0,
				perfect_prio: "low",
				migration: 0,
				migration_prio: "low",
				transaction: 0,
				transaction_prio: "low",
				fullstack_appowner_feedback: "",
				lead_sales: "",
				lead_se: "",
				business_champion: "",
				technical_champion: "",
				objectives: "",
				tool_replacement: "",
				saas: false,
				managed: false,
				offline: false,
				tenant: "",
				windows: false,
				linux: false,
				aix: false,
				solaris: false,
				vmware: false,
				azure: false,
				aws: false,
				openshift: false,
				cloudfoundry: false,
				ibmcloud: false,
				oraclecloud: false,
				gcp: false,
				heroku: false,
				openstack: false,
				kubernetes: false,
				iaas: false,
				paas: false,
				faas: false,
				softaas: false,
				java: false,
				dotnet: false,
				php: false,
				nodejs: false,
				messaging: false,
				c: false,
				dotnetcore: false,
				webserver: false,
				golang: false,
				mainframe: false,
				web: false,
				mobileapp: false,
				thick: false,
				citrix: false,
				browser: false,
				http: false,
				external: false,
				oaplugins: false,
				cnd: false,
				agplugins: false,
				externalevents: false,
				incidents: false,
				cmdb: false,
				api: false,
				iot: false,
				iib: false,
				python: false,
				docker: false,
				cloud: false,
				onprem: false,
				hybrid: false,
				outcomes_appowner_value: "",
				outcomes_cxo_value: "",
				autonomous_appowner_value: "",
				fullstack_ops_value: "",
				fullstack_dev_value: "",
				fullstack_appowner_value: ""
			};

			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) {
					db.close();
					console.log(err);
					res.redirect('/createnew_se?status=failed');
				}

				else {
					var collection = db.collection('se_assessments');
					collection.insert(se_assessments, {w:1}, function(err, result) { if(err!=null){console.log(err);}   });
					var collection = db.collection('se_user_assessments');
					collection.insert(se_user_assessments, {w:1}, function(err, result) { if(err!=null){console.log(err);}   });
					var collection = db.collection('se_assessment_data');
					collection.insert(se_assessment_data, {w:1}, function(err, result) { if(err!=null){console.log(err);}        });

					res.redirect('/landing');
					db.close();
				}
			});
		}

	});

	app.get('/getAssessmentList', (req, res) => {

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
				return console.dir(err);
			}

			var companyAssessment;

			var collection = db.collection('user_assessments');
			var results = collection.find({username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
				if(items.length == 0) {
					res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
					var body = [{_id: "new", username: req.session.username}];
					res.end(JSON.stringify(body));
					db.close();
				}

				if(items.length > 0) {
					res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
					res.end(JSON.stringify(items));
					db.close();
				}
			})
		})
	});

	app.get('/getSEAssessmentList', (req, res) => {

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				return console.dir(err);
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
			}

			var companyAssessment;

			var collection = db.collection('se_user_assessments');
			var results = collection.find({"username":username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
				if(items.length == 0) {
					res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
					var body = [{_id: "new", username: req.session.username}];
					res.end(JSON.stringify(body));
					db.close();
				}

				if(items.length > 0) {
					res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
					res.end(JSON.stringify(items));
					db.close();
				}
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
				collection.update({'_id':req.header('bva_id')},{$set:{'company_revenue':req.body.company_revenue,'projected_growth':req.body.projected_growth,'revenue_dependent':req.body.revenue_dependent,'app_uptime':req.body.app_uptime,'revenue_breach':req.body.revenue_breach,'incidents_month':req.body.incidents_month,'no_ops_troubleshoot':req.body.no_ops_troubleshoot,'no_dev_troubleshoot':req.body.no_dev_troubleshoot,'mttr':req.body.mttr,'no_apps_e2e':req.body.no_apps_e2e,'no_t1t2_apps':req.body.no_t1t2_apps, 'no_fte_existing':req.body.no_fte_existing, 'cycles_per_year':req.body.cycles_per_year, 'cycle_days':req.body.cycle_days, 'test_per_cycle':req.body.test_per_cycle, 'qa_time_per_cycle':req.body.qa_time_per_cycle, 'qa_people_per_cycle': req.body.qa_people_per_cycle, 'dev_time_per_cycle':req.body.dev_time_per_cycle, 'dev_people_per_cycle':req.body.dev_people_per_cycle, 'operation_cost':req.body.operation_cost, 'developer_cost':req.body.developer_cost, 'qa_cost':req.body.qa_cost, 'work_hours':req.body.work_hours, 'benefit_conversion': req.body.benefit_conversion, 'benefit_incident_reduction':req.body.benefit_incident_reduction, 'benefit_mttr':req.body.benefit_mttr, 'benefit_sla':req.body.benefit_sla, 'benefit_fix_qa':req.body.benefit_fix_qa, 'benefit_prod_reduction': req.body.benefit_prod_reduction, 'benefit_config': req.body.benefit_config, 'y1_software':req.body.y1_software, 'y1_services':req.body.y1_services, 'y2_software':req.body.y2_software, 'y2_services':req.body.y2_services, 'y3_software':req.body.y3_software, 'y3_services':req.body.y3_services}});

				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				res.end("success");
				db.close();
			}
		});
	});
	
	app.post('/updateSeAssessment', (req, res) => {

		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) {
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
				return console.dir(err);
			}

			else {
				var collection = db.collection('se_assessment_data');
				collection.update({'_id':req.header('se_id')},{$set:req.body});

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

	app.get('/getSeAssessmentData', (req, res) => {

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				return console.dir(err);
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
			}

			var collection = db.collection('se_assessment_data');
			var results = collection.find({'_id':req.header('se_id')}).toArray(function(err, items) {
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

	app.get('/getSeAssessmentMetaData', (req, res) => {

		var username = req.session.username;
		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				return console.dir(err);
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
			}

			var collection = db.collection('se_assessments');
			var results = collection.find({'_id':req.header('se_id')}).toArray(function(err, items) {
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
				var collection = db.collection('assessments');
				var results = collection.find({'_id':req.header('bva_id')}).toArray(function(err, items) {
					userDetails.currency=items[0].currency;
					userDetails.has_pricing=items[0].has_pricing;
					res.end(JSON.stringify(userDetails));
					db.close();
				})
			})
		})
	});

	app.get('/getSharedWith', (req, res) => {

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
				res.end(JSON.stringify(items));
				db.close();
			})
		})
	});	

	app.get('/getSeUserDetails', (req, res) => {

		var theUsername = req.session.username;

		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				return console.dir(err);
				res.writeHead(500, {'Access-Control-Allow-Headers':'content-type'});
				res.end("failure");
				db.close();
			}

			var collection = db.collection('se_user_assessments');
			var results = collection.find({'id':req.header('se_id')}).toArray(function(err, items) {
				res.writeHead(200, {'Access-Control-Allow-Headers':'content-type'});
				userDetails = {
					company: items[0].company,
					username: theUsername
				}
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

		if(username == "" || validateEmail(username) == false) {
			res.redirect('/reset?status=failed');
		}

		else {

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
					var results = collection.find({_id:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
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

							var email = username;
							var subject = "Reset your password"
							var text = "";
							var html = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\"><html style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"> <title></title> <style>@media only screen and (max-width: 580px){body{font-size: 16px !important;}table.container{width: 100% !important;}.button{font-size: 16px !important; line-height: 24px !important; border-top: 10px solid #00a1b2 !important; border-bottom: 10px solid #00a1b2 !important; border-right: 26px solid #00a1b2 !important; border-left: 26px solid #00a1b2 !important;}.cta-button{background-color: #7dc540 !important; border-top: 8px solid #7dc540 !important; border-bottom: 8px solid #7dc540 !important; border-right: 60px solid #7dc540 !important; border-left: 60px solid #7dc540 !important;}}</style> </head> <body style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <table class=\"body\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; padding: 0; border: 0; background-color: #ececec; border-collapse: collapse; margin: 0 auto; height: 100%; width: 100%!important;\" height=\"100%\" bgcolor=\"#ececec\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td align=\"center\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"container\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"580\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; border-collapse: collapse; width: 580px;\" bgcolor=\"#ffffff\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"header\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #242424; border-collapse: collapse; color: #ffffff; width: 100%!important;\" bgcolor=\"#242424\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px 30px;\" valign=\"top\"><img src=\"http://assets.dynatrace.com/global/logos/dynatrace_web-224x40.png\" alt=\"Dynatrace Logo\" style=\"display: block; max-width: 100%; height: 30px; margin: 0;\" height=\"30\"></td></tr></table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"content\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; width: 100%;\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"section\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; width: 100%!important;\" bgcolor=\"#ffffff\"><tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 40px 30px 60px;\" valign=\"top\"><h1 id=\"reset-your-password\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; margin-bottom: 15px;\">Reset your password</h1><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Hi " + items[0].firstName + ",</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">A password reset has been requested for your account, please use this link to reset your password within the next 24 hours: <a href=\"https://bva.herokuapp.com/resetpassword?token=" + resetLink + "\" style=\"color: #00a1b2; text-decoration: none;\">https://bva.herokuapp.com/resetpassword?token=" + resetLink + "</a></p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Many thanks,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">The BVA (Business Value Assessment) team</p></td></tr></tbody></table> </td></tr></tbody> </table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"footer\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #353535; color: #ffffff; font-size: 12px; text-align: center; width: 100%!important;\" bgcolor=\"#353535\" align=\"center\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px;\" valign=\"top\"> <p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px; color: #ffffff;\">© 2018 Dynatrace LLC. All Rights Reserved<br><a href=\"https://www.dynatrace.com/\" style=\"color: #ffffff; text-decoration: underline;\">dynatrace.com</a></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>";

							sendMail(email, subject, text, html);

							res.redirect('/reset?status=success');
							db.close();
						}
					});
				}
			});
		}
	});

	app.post('/sharebva', (req, res) => {
		var id = req.query.bva_id;
		var username = req.session.username;
		var username_share = req.body.username_share;

		if(username_share == "" || validateEmail(username_share) == false) {
			res.redirect('/share?bva_id=' + id + '&status=failed');
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
				var results = collection.find({id:id, username:username_share}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(err) {
						console.log(err);
						res.redirect('/share?bva_id=' + id + "&status=failed");
					}
					else {
						if(items[0] == undefined) {
							var collection = db.collection('user_assessments');
							var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

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
										var html = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\"><html style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"> <title></title> <style>@media only screen and (max-width: 580px){body{font-size: 16px !important;}table.container{width: 100% !important;}.button{font-size: 16px !important; line-height: 24px !important; border-top: 10px solid #00a1b2 !important; border-bottom: 10px solid #00a1b2 !important; border-right: 26px solid #00a1b2 !important; border-left: 26px solid #00a1b2 !important;}.cta-button{background-color: #7dc540 !important; border-top: 8px solid #7dc540 !important; border-bottom: 8px solid #7dc540 !important; border-right: 60px solid #7dc540 !important; border-left: 60px solid #7dc540 !important;}}</style> </head> <body style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <table class=\"body\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; padding: 0; border: 0; background-color: #ececec; border-collapse: collapse; margin: 0 auto; height: 100%; width: 100%!important;\" height=\"100%\" bgcolor=\"#ececec\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td align=\"center\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"container\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"580\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; border-collapse: collapse; width: 580px;\" bgcolor=\"#ffffff\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"header\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #242424; border-collapse: collapse; color: #ffffff; width: 100%!important;\" bgcolor=\"#242424\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px 30px;\" valign=\"top\"><img src=\"http://assets.dynatrace.com/global/logos/dynatrace_web-224x40.png\" alt=\"Dynatrace Logo\" style=\"display: block; max-width: 100%; height: 30px; margin: 0;\" height=\"30\"></td></tr></table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"content\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; width: 100%;\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"section\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; width: 100%!important;\" bgcolor=\"#ffffff\"><tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 40px 30px 60px;\" valign=\"top\"><h1 id=\"a-new-assessment\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; margin-bottom: 15px;\">A new assessment</h1><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Hi,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">You have a new assessment that has been shared by " + username + ", titled \"" + company + ".\"</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Please login to access <a href=\"http://dynatrace.ai/bva\" style=\"color: #00a1b2; text-decoration: none;\">here</a>, or if you don't have an account create one first!</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Many thanks,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">The BVA (Business Value Assessment) team</p></td></tr></tbody></table> </td></tr></tbody> </table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"footer\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #353535; color: #ffffff; font-size: 12px; text-align: center; width: 100%!important;\" bgcolor=\"#353535\" align=\"center\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px;\" valign=\"top\"> <p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px; color: #ffffff;\">© 2018 Dynatrace LLC. All Rights Reserved<br><a href=\"https://www.dynatrace.com/\" style=\"color: #ffffff; text-decoration: underline;\">dynatrace.com</a></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>";

										sendMail(email, subject, text, html);

										res.redirect('/share?bva_id=' + id + "&status=success");
									}
								});
							})
						}
						else {
							res.redirect('/share?bva_id=' + id + "&status=failed");
						}
					}
				})
			}
		});

		}
	});

	app.post('/shareSeBva', (req, res) => {
		var id = req.query.se_id;
		var username = req.session.username;
		var username_share = req.body.username_share;

		if(username_share == "" || validateEmail(username_share) == false) {
			res.redirect('/share_se?se_id=' + id + '&status=failed');
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
				var collection = db.collection('se_user_assessments');
				var results = collection.find({id:id, username:username_share}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(err) {
						console.log(err);
						db.close();
						res.redirect('/share_se?se_id=' + id + "&status=failed");
					}
					else {
						if(items[0] == undefined) {

							var collection = db.collection('se');
							var results = collection.find({email:username_share}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

							if(items[0] != undefined) {
								var collection = db.collection('se_user_assessments');
								var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

								var company = items[0].company;

								var newShare = {
									id:id,
									company: company,
									username: username_share
								}

								var collection = db.collection('se_user_assessments');
								collection.insert(newShare, {w:1}, function(err, result) {
									if(err!=null){
										console.log(err);
										db.close();
										res.redirect('/share_se?se_id=' + id + "&status=failed");
									}
									else {
										var email = username_share;
										var subject = "You have a new SE assessment!"
										var text = "";
										var html = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\"><html style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"> <title></title> <style>@media only screen and (max-width: 580px){body{font-size: 16px !important;}table.container{width: 100% !important;}.button{font-size: 16px !important; line-height: 24px !important; border-top: 10px solid #00a1b2 !important; border-bottom: 10px solid #00a1b2 !important; border-right: 26px solid #00a1b2 !important; border-left: 26px solid #00a1b2 !important;}.cta-button{background-color: #7dc540 !important; border-top: 8px solid #7dc540 !important; border-bottom: 8px solid #7dc540 !important; border-right: 60px solid #7dc540 !important; border-left: 60px solid #7dc540 !important;}}</style> </head> <body style=\"background-color: #ececec; color: #454646; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 300; height: 100%; margin: 0; padding: 0;\"> <table class=\"body\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; padding: 0; border: 0; background-color: #ececec; border-collapse: collapse; margin: 0 auto; height: 100%; width: 100%!important;\" height=\"100%\" bgcolor=\"#ececec\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td align=\"center\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"container\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"580\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; border-collapse: collapse; width: 580px;\" bgcolor=\"#ffffff\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"header\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #242424; border-collapse: collapse; color: #ffffff; width: 100%!important;\" bgcolor=\"#242424\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px 30px;\" valign=\"top\"><img src=\"http://assets.dynatrace.com/global/logos/dynatrace_web-224x40.png\" alt=\"Dynatrace Logo\" style=\"display: block; max-width: 100%; height: 30px; margin: 0;\" height=\"30\"></td></tr></table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"content\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; width: 100%;\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"section\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #ffffff; width: 100%!important;\" bgcolor=\"#ffffff\"><tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"><td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 40px 30px 60px;\" valign=\"top\"><h1 id=\"a-new-assessment\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; margin-bottom: 15px;\">A new assessment</h1><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Hi,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">You have a new assessment that has been shared by " + username + ", titled \"" + company + ".\"</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Please login to access <a href=\"http://dynatrace.ai/bva\" style=\"color: #00a1b2; text-decoration: none;\">here</a>, or if you don't have an account create one first!</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">Many thanks,</p><p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px;\">The BVA (Business Value Assessment) team</p></td></tr></tbody></table> </td></tr></tbody> </table> </td></tr><tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; vertical-align: top;\" valign=\"top\"> <table class=\"footer\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; background-color: #353535; color: #ffffff; font-size: 12px; text-align: center; width: 100%!important;\" bgcolor=\"#353535\" align=\"center\"> <tbody style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <tr style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0;\"> <td style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; border: 0; vertical-align: top; padding: 15px;\" valign=\"top\"> <p style=\"font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; border: 0; font-weight: 300; line-height: 22px; margin-bottom: 20px; color: #ffffff;\">© 2018 Dynatrace LLC. All Rights Reserved<br><a href=\"https://www.dynatrace.com/\" style=\"color: #ffffff; text-decoration: underline;\">dynatrace.com</a></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>";

										sendMail(email, subject, text, html);

										res.redirect('/share_se?se_id=' + id + "&status=success");
										db.close();
									}
								});
							})
							}
							else {
								res.redirect('/share_se?se_id=' + id + "&status=failed");
								db.close();
							}
							})
						}
						else {
							res.redirect('/share_se?se_id=' + id + "&status=failed");
							db.close();
						}
					}
				})
			}
		});

		}
	});

	app.get('/giveMeBva', (req, res) => {
		var id = req.header('bva_id');
		var company = req.header('company');
		var username = req.session.username;

		var successBody = {
			status: "success"
		}

		var failBody = {
			status: "fail"
		}

		if(id == "") {
			res.end(JSON.stringify(failBody));
		}

		else {
		MongoClient.connect(connectionOptions, function(err, db) {
			if(err) {
				return console.dir(err);
				res.end(JSON.stringify(failBody));
				db.close();
			}

			else {

				var collection = db.collection('user_assessments');
				var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

					if(items[0] != undefined) {
						res.end(JSON.stringify(failBody));
						db.close();
					}

					else {
						newShare = {
							id: id,
							company: company,
							username: username
						}

						var collection = db.collection('user_assessments');
						collection.insert(newShare, {w:1}, function(err, result) {
							if(err!=null){
								console.log(err);
								db.close();
								res.end(JSON.stringify(failBody));
							}
							else {
								db.close();
								res.end(JSON.stringify(successBody));
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
		var currency = req.body.currency;

		if(username == "" || company == "" || currency == "") {
			res.redirect('/edit?bva_id=' + id + '&status=failed');
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
					var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
						if(err) {
							console.log(err);
							res.redirect('/edit?bva_id=' + id + "&status=failed");
						}
						else {
							if(items[0] == undefined) {
								res.redirect('/landing');
							}
							else {
								var collection = db.collection('assessments');
								collection.update({'_id':id},{$set:{'company':company, 'currency':currency}});

								var collection = db.collection('user_assessments');
								collection.update({'id':id},{$set:{'company':company}});

								res.redirect('/edit?bva_id=' + id + "&status=success");
							}
						}
					})
				}
			});
		}
	});

	app.post('/editSeBva', (req, res) => {
		var bva_id = req.body.bva_id;
		var username = req.session.username;
		var company = req.body.company;
		var se_id = req.query.se_id;

		console.log(bva_id);
		console.log(company);
		console.log(se_id);

		if(username == "" || company == "" || bva_id == "") {
			res.redirect('/edit_se?se_id=' + id + '&status=failed');
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
					var collection = db.collection('se_user_assessments');
					var results = collection.find({id:se_id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
						if(err) {
							console.log(err);
							res.redirect('/edit_se?bva_id=' + id + "&status=failed");
						}
						else {
							if(items[0] == undefined) {
								res.redirect('/landing');
							}
							else {
								var collection = db.collection('se_assessments');
								collection.update({'_id':se_id},{$set:{'company':company, 'bva_id':bva_id}});

								var collection = db.collection('se_user_assessments');
								collection.update({'id':se_id},{$set:{'company':company}});

								res.redirect('/edit_se?se_id=' + se_id + "&status=success");
							}
						}
					})
				}
			});
		}
	});

	app.get('/deleteAssessment', (req, res) => {
		var id = req.query.bva_id;
		var username = req.session.username;

		if(id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) {
					res.redirect('/edit?bva_id=' + id + '&status=failed');
					db.close();
				}

				else {
					var collection = db.collection('user_assessments');
					var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
						if(err) {
							console.log(err);
							res.redirect('/edit?bva_id=' + id + "&status=failed");
						}
						else {
							if(items[0] == undefined){
								res.redirect('/landing');
							}

							else {
								var collection = db.collection('assessments');
								collection.remove({_id: id}, function(err, result) {

								})

								var collection = db.collection('user_assessments');
								collection.remove({id: id}, function(err, result) {

								})

								var collection = db.collection('assessment_data');
								collection.remove({_id: id}, function(err, result) {

								})


								res.redirect("/landing");
							}
						}
					})
				}
			});

		}
	});

	app.get('/deleteSeAssessment', (req, res) => {
		var id = req.query.se_id;
		var username = req.session.username;

		if(id == "") {
			res.redirect('/landing');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				if(err) {
					res.redirect('/edit_se?se_id=' + id + '&status=failed');
					db.close();
				}

				else {
					var collection = db.collection('se_user_assessments');
					var results = collection.find({id:id, username:username}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
						if(err) {
							console.log(err);
							res.redirect('/edit_se?se_id=' + id + "&status=failed");
						}
						else {
							if(items[0] == undefined){
								res.redirect('/landing');
							}

							else {
								var collection = db.collection('se_assessments');
								collection.remove({_id: id}, function(err, result) {

								})

								var collection = db.collection('se_user_assessments');
								collection.remove({id: id}, function(err, result) {

								})

								var collection = db.collection('se_assessment_data');
								collection.remove({_id: id}, function(err, result) {

								})


								res.redirect("/landing");
							}
						}
					})
				}
			});

		}
	});

	app.get('/searchUsers', (req, res) => {

		var username = req.session.username;
		var emailSearch = req.header('emailSearch');
		var results = new RegExp('(@dynatrace.com)').exec(username);

		if(username == "" || results == false) {
			res.redirect('/');
		}

		else {

			var queryRegex = new RegExp('.*' + emailSearch + '.*');
			var queryRegex2 = {$regex : queryRegex, $options: 'i'};
			
			var query = {username: queryRegex2};

			MongoClient.connect(connectionOptions, function(err, db) {

				if(err) {
					var response = {"status":"failed"};
					res.end(JSON.stringify(response));
					db.close();
				}

				var collection = db.collection('user_assessments');
				var results = collection.find(query).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(err || items[0] == undefined) {
						var response = {"status":"failed"};
						res.end(JSON.stringify(response));
						db.close();
					}

					else {
						resultArray = [];
						for(i=0;i<items.length;i++) {
							resultItem = {
								_id: items[i].id
							}
							resultArray.push(resultItem);
						}
						var collection = db.collection('assessments');
						var results = collection.find({$or:resultArray}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

							res.end(JSON.stringify(items));
							db.close();
						})
					}
				})
			})
		}
	});

	app.get('/searchSEYou', (req, res) => {

		var emailSearch = req.session.username;
		var results = new RegExp('(@dynatrace.com)').exec(emailSearch);

		if(emailSearch == "" || results == false) {
			res.redirect('/');
		}

		else {

			var queryRegex = new RegExp('.*' + emailSearch + '.*');
			var queryRegex2 = {$regex : queryRegex, $options: 'i'};
			
			var query = {username: queryRegex2};

			MongoClient.connect(connectionOptions, function(err, db) {

				if(err) {
					var response = {"status":"failed"};
					res.end(JSON.stringify(response));
					db.close();
				}

				var collection = db.collection('user_assessments');
				var results = collection.find(query).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(err || items[0] == undefined) {
						var response = {"status":"failed"};
						res.end(JSON.stringify(response));
						db.close();
					}

					else {
						resultArray = [];
						for(i=0;i<items.length;i++) {
							resultItem = {
								_id: items[i].id
							}
							resultArray.push(resultItem);
						}
						var collection = db.collection('assessments');
						var results = collection.find({$or:resultArray}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

							res.end(JSON.stringify(items));
							db.close();
						})
					}
				})
			})
		}
	});	

	app.post('/seOppSearch', (req, res) => {
		var searchTerms = req.body;

		//companyRegex = new RegExp('.*' + req.body.company + '.*');
		salesRegex = new RegExp('.*' + req.body.lead_sales + '.*');
		seRegex = new RegExp('.*' + req.body.lead_se + '.*');
		busRegex = new RegExp('.*' + req.body.business_champion + '.*');
		techRegex = new RegExp('.*' + req.body.technical_champion + '.*');
		tenantRegex = new RegExp('.*' + req.body.tenant + '.*');
		toolRegex = new RegExp('.*' + req.body.tool_replacement + '.*');
		objectivesRegex = new RegExp('.*' + req.body.objectives + '.*');

		//searchTerms.company = {$regex : companyRegex, $options: 'i'};
		searchTerms.lead_sales = {$regex : salesRegex, $options: 'i'};
		searchTerms.lead_se = {$regex : seRegex, $options: 'i'};
		searchTerms.business_champion = {$regex : busRegex, $options: 'i'};
		searchTerms.technical_champion = {$regex : techRegex, $options: 'i'};
		searchTerms.tenant = {$regex : tenantRegex, $options: 'i'};
		
		searchTerms.tool_replacement = {$regex : toolRegex, $options: 'i'};
		searchTerms.objectives = {$regex : objectivesRegex, $options: 'i'};

		options = ["saas","managed","offline","windows","linux","aix","solaris","vmware","azure","aws","openshift","cloudfoundry","ibmcloud","oraclecloud","gcp","heroku","openstack","kubernetes","iaas","paas","faas","softaas","java","dotnet","php","nodejs","messaging","c","dotnetcore","webserver","golang","mainframe","web","mobileapp","thick","citrix","browser","http","external","oaplugins","cnd","agplugins","externalevents","incidents","cmdb"];

		for(i=0;i<options.length;i++) {
			if(searchTerms[options[i]] != undefined) {
				searchTerms[options[i]] = true;
			}
		}

		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				var response = {"status":"failed"};
				res.end(JSON.stringify(response));
				db.close();
			}

			var collection = db.collection('se_assessment_data');
			var results = collection.find(searchTerms).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
				if(err || items[0] == undefined) {
					console.log("no results");
					var response = {"status":"failed"};
					res.end(JSON.stringify(response));
					db.close();
				}

				else {
					res.end(JSON.stringify(items));
					db.close();
					
				}
			})
		})
	});

	app.post('/getBvaFromSe', (req, res) => {
		var search = req.body;

		console.log(req.body);

		MongoClient.connect(connectionOptions, function(err, db) {

			if(err) {
				var response = {"status":"failed"};
				res.end(JSON.stringify(response));
				db.close();
			}

			var collection = db.collection('se_assessments');
			var results = collection.find({$or:search}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
				if(err || items[0] == undefined) {
					console.log("no results");
					var response = {"status":"failed"};
					res.end(JSON.stringify(response));
					db.close();
				}

				else {
					res.end(JSON.stringify(items));
					db.close();					
				}
			})
		})
	});

	app.get('/seBvaSearch', (req, res) => {

		var username = req.session.username;
		var search = req.header('Search');
		var results = new RegExp('(@dynatrace.com)').exec(username);

		if(username == "" || results == false) {
			res.redirect('/');
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {

				if(err) {
					var response = {"status":"failed"};
					res.end(JSON.stringify(response));
					db.close();
				}

				var queryRegex = new RegExp('.*' + search + '.*');
				var queryRegex2 = {$regex : queryRegex, $options: 'i'};
				
				var query = {company: queryRegex2};

				var collection = db.collection('assessments');
				var results = collection.find(query).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
					if(err) {
						var response = {"status":"failed"};
						res.end(JSON.stringify(response));
						db.close();
					}

					if(items[0] != undefined) {
						resultArray = [];
						for(i=0;i<items.length;i++) {
							resultItem = {
								_id: items[i]._id,
								company: items[i].company
							}
							resultArray.push(resultItem);
						}

						//var collection = db.collection('assessments');
						//var results = collection.find({$or:resultArray}).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {

							res.end(JSON.stringify(items));
							db.close();
						}

						if(items[0] == undefined) {
							var query = { _id: new RegExp('^' +  search)};
							var results = collection.find(query).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
								if(items[0] != undefined) {
									resultArray = [];
									for(i=0;i<items.length;i++) {
										resultItem = {
											_id: items[i]._id,
											company: items[i].company
										}
										resultArray.push(resultItem);
									}
									res.end(JSON.stringify(items));
									db.close();
								}
								else {
									var response = {"status":"failed"};
									res.end(JSON.stringify(response));
									db.close();
								}
							})
						}
					})
				})
			}
	});

	app.get('/logout', function(req, res) {
		req.session.destroy();
		res.redirect('/');
	});

	app.post('/changeAssessment', (req, res) => {
		if(req.body.listOfIds == "") {
			res.redirect('/editassessment?status=failed');
		}

		else {
		var id = JSON.parse(req.body.listOfIds);

		var assessmentUpdate = [];

		for(i=0;i<id.length;i++){
			var has_pricing = req.body[id[i].id + "_pricing"];

			if(has_pricing == "Yes") {
				has_pricing = true;
			}

			else {
				has_pricing = false;
			}

			var sfdc = req.body[id[i].id + "_sfdc"];


			var add = {
				has_pricing: has_pricing,
				sfdc: sfdc
			}

			assessmentUpdate.push(add);
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

				for(i=0;i<id.length;i++) {
					var has_pricing = assessmentUpdate[i].has_pricing;
					var sfdc = assessmentUpdate[i].sfdc;
					collection.update({'_id':id[i].id},{$set:{"has_pricing": has_pricing, "sfdc":sfdc}});
				}

				res.redirect('/editassessment?status=success');
			}
		});

		}
	});

	app.get('/seCheck', (req, res) => {
		var username = req.session.username;
		var results = new RegExp('(@dynatrace.com)').exec(username);

		if(username == "" || results == false) {
			console.log("first");
			return false;
		}

		else {
			MongoClient.connect(connectionOptions, function(err, db) {
				var collection = db.collection('se');
				collection.findOne({"email":username}, {collation:{ locale: "en", strength: 2 }}, function(err, result) {
					if (err) throw err;
						if(result == null) {
							db.close();
							var response = {"status":"other"};
							res.end(JSON.stringify(response));
						}
						else {
							db.close();
							var response = {"status":"se"};
							res.end(JSON.stringify(response));
						}
					});
				})
		}

	});
	
	app.get('/users', (req, res) => {

		MongoClient.connect(connectionOptions, function(err, db) {
			var query = { benefit_config: new RegExp('\w*')};
					var collection = db.collection('assessment_data');
					var results = collection.find(query).collation({locale: 'en', strength: 2 }).toArray(function(err, items) {
						if(err) {
							console.log(err);
						}
						else {

						
						
						
						
						
						
function getNumbers(txt) {
	if (txt != "" && txt != null) {
		var numb = txt.match(/\d/g);
		numb = numb.join("");

		return numb;
	}

	else {
		return "";
	}
}

function getNumbersAndDots(txt) {
	if (txt != "" && txt != null) {
		var numb = txt.match(/\d+\.?\d?/g);
		numb = numb.join("");
		return numb;
	}

	else {
		if(txt == "") {
			return "";
		}
		else {
			return 0;
		}
	}
}						
				
				
			revenueDowntimeTotalNum	= 0;
			revenueConversionTotalNum = 0;	
				
			existingTotalNum = 0;	
			opsIncidentCostTotalNum = 0;	
			effortSavingTotalNum = 0;	
				
			devQaTotalNum = 0;	
			devLowerIncidentsTotalNum = 0;	
				
				
				
			revenueDowntimeTot = 0;
			revenueConversionTot = 0;
			
			existingTot = 0;
			opsIncidentCostTot = 0;
			effortSavingTot = 0;
			
			devQaTot = 0;
			devLowerIncidentsTot = 0;

			for(i=0;i<items.length;i++) {
			//OPERATIONS - get rid of tools
			if(items[i].existing_apps.length == 0) {
					existingy1 = 0;
					existingy2 = 0;
					existingy3 = 0;
					existingTotal = 0;

					var opsCase1 = 0;
			}

			else {
				number = items[i].existing_apps.length;

				var existingy1 = 0;
				var existingy2 = 0;
				var existingy3 = 0;

				for(x=0;x<number;x++) {
					annual_cost = (parseFloat(items[i].existing_apps[x].annual_costs)) + (parseFloat(items[i].existing_apps[x].ftes) * parseFloat(items[i].operation_cost));
					percent1 = (parseFloat(items[i].existing_apps[x].y1)/100);
					percent2 = (parseFloat(items[i].existing_apps[x].y2)/100);
					percent3 = (parseFloat(items[i].existing_apps[x].y3)/100);
					existingy1 = parseInt(existingy1 + (annual_cost * percent1));
					existingy2 = parseInt(existingy2 + (annual_cost * percent2));
					existingy3 = parseInt(existingy3 + (annual_cost * percent3));
					existingTotal = existingy1 + existingy2 + existingy3;
				}

				var opsCase1 = 1;
				
				if(existingTotal != 0) {
					
				}
			}

			//BUSINESS - revenue increase
			revenue = parseFloat(getNumbersAndDots(items[i].company_revenue));

			percent = parseFloat(getNumbersAndDots(items[i].revenue_dependent));
			percent = percent / 100;

			growth = parseFloat(getNumbersAndDots(items[i].projected_growth));
			growth = growth / 100;

			uptime = parseFloat(getNumbersAndDots(items[i].app_uptime));
			uptime = uptime / 100;

			breach = parseFloat(getNumbersAndDots(items[i].revenue_breach));
			breach = breach / 100;

			benefit_sla = parseInt(getNumbersAndDots(items[i].benefit_sla));
			benefit_sla = benefit_sla / 100;

			if(isNaN(revenue) == true || revenue == 0 || isNaN(percent) == true || percent == 0 || isNaN(growth) == true || growth == 0 || isNaN(uptime) == true || uptime == 0 || isNaN(breach) == true || breach == 0 || isNaN(benefit_sla) == true || benefit_sla == 0) {
				revenueDowntimeY1 = 0;
				revenueDowntimeY2 = 0;
				revenueDowntimeY3 = 0;
				revenueDowntimeTotal = 0;

				var bizCase1 = 0;
			}

			else {
				revenueLost = ((revenue * percent)/8760)*(8760*(1-uptime))*breach;

				revenueDowntimeY1 = parseInt(revenueLost * benefit_sla);
				revenueDowntimeY2 = parseInt(revenueDowntimeY1 * (1+growth));
				revenueDowntimeY3 = parseInt(revenueDowntimeY2 * (1+growth));
				revenueDowntimeTotal = revenueDowntimeY1 + revenueDowntimeY2 + revenueDowntimeY3;

				var bizCase1 = 1;

			}

			//BUSINESS - conversions
			revenue = parseFloat(getNumbersAndDots(items[i].company_revenue));

			percent = parseFloat(getNumbersAndDots(items[i].revenue_dependent));
			percent = percent / 100;

			conversion = parseFloat(getNumbersAndDots(items[i].benefit_conversion));
			conversion = conversion / 100;

			growth = parseFloat(getNumbersAndDots(items[i].projected_growth));
			growth = growth / 100;

			if(isNaN(revenue) == true || revenue == 0 || isNaN(percent) == true || percent == 0 || isNaN(conversion) == true || conversion == 0 || isNaN(growth) == true || growth == 0) {
				revenueConversionY1 = 0;
				revenueConversionY2 = 0;
				revenueConversionY3 = 0;
				revenueConversionTotal = 0;

				var bizCase2 = 0;
			}

			else {
				revenueConversionY1 = parseInt((revenue * percent) * conversion);
				revenueConversionY2 = parseInt(revenueConversionY1 * (1+growth));
				revenueConversionY3 = parseInt(revenueConversionY2 * (1+growth));
				revenueConversionTotal = revenueConversionY1 + revenueConversionY2 + revenueConversionY3;

				var bizCase2 = 1;
			}

			//OPERATIONS - incident reduction
			incidents_month = parseFloat(getNumbersAndDots(items[i].incidents_month));

			if(items[i].projected_growth == "") {
				growth = 0;
			}
			else {
				growth = parseFloat(getNumbersAndDots(items[i].projected_growth));
				growth = growth / 100;
			}

			no_ops_troubleshoot = parseFloat(getNumbersAndDots(items[i].no_ops_troubleshoot));

			no_dev_troubleshoot = parseFloat(getNumbersAndDots(items[i].no_dev_troubleshoot));

			mttr = parseFloat(getNumbersAndDots(items[i].mttr));

			benefit_incident_reduction = parseFloat(getNumbersAndDots(items[i].benefit_incident_reduction));

			benefit_incident_reduction = benefit_incident_reduction / 100;

			benefit_mttr = parseFloat(getNumbersAndDots(items[i].benefit_mttr));
			benefit_mttr = benefit_mttr / 100;

			ops_cost = parseFloat(getNumbersAndDots(items[i].operation_cost));

			dev_cost = parseFloat(getNumbersAndDots(items[i].developer_cost));

			work_hours = parseFloat(getNumbersAndDots(items[i].work_hours));

			if(isNaN(incidents_month) == true || incidents_month == 0 || isNaN(growth) == true || isNaN(no_ops_troubleshoot) == true || isNaN(no_dev_troubleshoot) == true || isNaN(mttr) == true || mttr == 0 || isNaN(benefit_incident_reduction) == true || benefit_incident_reduction == 0 || isNaN(benefit_mttr) == true || benefit_mttr == 0 || isNaN(ops_cost) == true || ops_cost == 0 || isNaN(dev_cost) == true || dev_cost == 0 || isNaN(work_hours) == true || work_hours == 0) {
				opsIncidentCostY1 = 0;
				opsIncidentCostY2 = 0;
				opsIncidentCostY3 = 0;
				opsIncidentCostTotal = 0;

				var opsCase2 = 0;
			}

			else {
				incidentsYear = incidents_month * 12;
				opsHours = incidentsYear * no_ops_troubleshoot * (mttr / 60);
				opsCost = opsHours * (ops_cost / work_hours);
				devHours = incidentsYear * no_dev_troubleshoot * (mttr / 60);
				devCost = devHours * (dev_cost / work_hours);
				incidentCost = opsCost + devCost;

				after_incidentsYear = incidentsYear * (1 - benefit_incident_reduction);
				after_opsHours = after_incidentsYear * no_ops_troubleshoot * (mttr / 60) * (1-benefit_mttr);
				after_opsCost = after_opsHours * (ops_cost / work_hours);
				after_devHours = after_incidentsYear * no_dev_troubleshoot * (mttr / 60) * (1-benefit_mttr);
				after_devCost = after_devHours * (dev_cost / work_hours);
				after_incidentCost = after_opsCost + after_devCost;

				opsIncidentCostY1 = parseInt(incidentCost - after_incidentCost);
				opsIncidentCostY2 = parseInt(opsIncidentCostY1 * (1+growth));
				opsIncidentCostY3 = parseInt(opsIncidentCostY2 * (1+growth));
				opsIncidentCostTotal = opsIncidentCostY1 + opsIncidentCostY2 + opsIncidentCostY3;

				var opsCase2 = 1;
			}

			//OPERATIONS - cost of automation
			no_fte_existing = parseFloat(getNumbersAndDots(items[i].no_fte_existing));

			no_apps_e2e = parseFloat(getNumbersAndDots(items[i].no_apps_e2e));

			no_t1t2_apps = parseFloat(getNumbersAndDots(items[i].no_t1t2_apps));

			benefit_config = parseFloat(getNumbersAndDots(items[i].benefit_config));
			benefit_config = benefit_config / 100;

			if(isNaN(no_fte_existing) == true || no_fte_existing == 0 || isNaN(no_apps_e2e) == true || no_apps_e2e == 0 || isNaN(no_t1t2_apps) == true || no_t1t2_apps == 0 || isNaN(benefit_config) == true || benefit_config == 0 || isNaN(growth) == true) {
				effortSavingY1 = 0;
				effortSavingY2 = 0;
				effortSavingY3 = 0;
				effortSavingTotal = 0;

				var opsCase3 = 0;
			}

			else {
				costPerApp = ((no_fte_existing * ops_cost)/no_apps_e2e);
				costAllApps = costPerApp * no_t1t2_apps;

				after_costPerApp = costPerApp * benefit_config;
				after_costAllApps = after_costPerApp * no_t1t2_apps;

				effortBefore = costPerApp * no_apps_e2e;
				effortAfter = effortBefore * (1 - benefit_config);

				effortSavingY1 = parseInt(effortBefore - effortAfter);
				effortSavingY2 = parseInt(effortSavingY1 * (1+growth));
				effortSavingY3 = parseInt(effortSavingY2 * (1+growth));
				effortSavingTotal = effortSavingY1 + effortSavingY2 + effortSavingY3;

				var opsCase3 = 1;

			}

			//DEV AND QA - effort

			cycles_per_year = parseFloat(getNumbersAndDots(items[i].cycles_per_year));

			cycle_days = parseFloat(getNumbersAndDots(items[i].cycle_days));

			test_per_cycle = parseFloat(getNumbersAndDots(items[i].test_per_cycle));
			test_per_cycle = test_per_cycle / 100;

			qa_time_per_cycle = parseFloat(getNumbersAndDots(items[i].qa_time_per_cycle));
			qa_time_per_cycle = qa_time_per_cycle / 100;

			qa_people_per_cycle = parseFloat(getNumbersAndDots(items[i].qa_people_per_cycle));

			dev_time_per_cycle = parseFloat(getNumbersAndDots(items[i].dev_time_per_cycle));
			dev_time_per_cycle = dev_time_per_cycle / 100;

			dev_people_per_cycle = parseFloat(getNumbersAndDots(items[i].dev_people_per_cycle));

			benefit_fix_qa = parseFloat(getNumbersAndDots(items[i].benefit_fix_qa));
			benefit_fix_qa = benefit_fix_qa / 100;

			qa_cost = parseFloat(getNumbersAndDots(items[i].qa_cost));

			if(isNaN(cycles_per_year) == true || cycles_per_year == 0 || isNaN(cycle_days) == true || cycle_days == 0 || isNaN(test_per_cycle) == true || test_per_cycle == 0 || isNaN(qa_time_per_cycle) == true || qa_time_per_cycle == 0 || isNaN(qa_people_per_cycle) == true || qa_people_per_cycle == 0 || isNaN(dev_time_per_cycle) == true || dev_time_per_cycle == 0 || isNaN(dev_people_per_cycle) == true || dev_people_per_cycle == 0 || isNaN(benefit_fix_qa) == true || benefit_fix_qa == 0 || isNaN(qa_cost) == true || qa_cost == 0 || isNaN(growth) == true) {
				devQaY1 = 0;
				devQaY2 = 0;
				devQaY3 = 0;
				devQaTotal = 0;

				var devCase1 = 0;
			}

			else {

				non_test_cycle = cycle_days * (1 - test_per_cycle);
				test_cycle = cycle_days * test_per_cycle;

				days_not_performance = test_cycle * (1-(qa_time_per_cycle + dev_time_per_cycle));
				days_performance = test_cycle * (qa_time_per_cycle + dev_time_per_cycle);

				dt_days_performance = days_performance * (1-benefit_fix_qa);
				dt_cycle_days = non_test_cycle + days_not_performance + dt_days_performance;
				dt_times_release = cycle_days / dt_cycle_days;
				dt_release_year = cycles_per_year  * dt_times_release;

				qa_cost_performance	= test_cycle * cycles_per_year * qa_time_per_cycle * qa_people_per_cycle * (qa_cost/work_hours) * 8;
				dev_cost_performance = test_cycle * cycles_per_year * dev_time_per_cycle * dev_people_per_cycle * (dev_cost/work_hours) * 8;
				total_effort_performance = qa_cost_performance + dev_cost_performance;
				dt_qa_effort = benefit_fix_qa * total_effort_performance;

				devQaY1 = parseInt(dt_qa_effort);
				devQaY2 = parseInt(devQaY1 * (1+growth));
				devQaY3 = parseInt(devQaY2 * (1+growth));
				devQaTotal = devQaY1 + devQaY2 + devQaY3;

				var devCase1 = 1;
			}
			//DEV AND QA - fewer incidents

			incidentsYear = incidents_month * 12;
			opsHours = incidentsYear * no_ops_troubleshoot * (mttr / 60);
			opsCost = opsHours * (ops_cost / work_hours);
			devHours = incidentsYear * no_dev_troubleshoot * (mttr / 60);
			devCost = devHours * (dev_cost / work_hours);
			incidentCost = opsCost + devCost;

			benefit_prod_reduction = parseFloat(getNumbersAndDots(items[i].benefit_prod_reduction));
			benefit_prod_reduction = benefit_prod_reduction / 100;

			if(isNaN(incidentsYear) == true || incidentsYear == 0 || isNaN(opsHours) == true || opsHours == 0 || isNaN(opsCost) == true || opsCost == 0 || isNaN(devHours) == true || devHours == 0 || isNaN(devCost) == true || devCost == 0 || isNaN(incidentCost) == true || incidentCost == 0 || isNaN(benefit_prod_reduction) == true || benefit_prod_reduction == 0 || isNaN(incidents_month) == true || incidents_month == 0 || isNaN(no_ops_troubleshoot) == true || no_ops_troubleshoot == 0 || isNaN(no_dev_troubleshoot) == true || no_dev_troubleshoot == 0 || isNaN(work_hours) == true || work_hours == 0 || isNaN(mttr) == true || mttr == 0 || isNaN(growth) == true) {
				devLowerIncidentsY1 = 0;
				devLowerIncidentsY2 = 0;
				devLowerIncidentsY3 = 0;
				devLowerIncidentsTotal = 0;

				var devCase2 = 0;
			}

			else {
				devLowerIncidentsY1 = parseInt(incidentCost * (1 - benefit_prod_reduction));
				devLowerIncidentsY2 = parseInt(devLowerIncidentsY1 * (1+growth));
				devLowerIncidentsY3 = parseInt(devLowerIncidentsY2 * (1+growth));
				devLowerIncidentsTotal = devLowerIncidentsY1 + devLowerIncidentsY2 + devLowerIncidentsY3;

				var devCase2 = 1;
			}

			//DEV QA - total

			devY1 = parseInt(devQaY1 + devLowerIncidentsY1);
			devY2 = parseInt(devQaY2 + devLowerIncidentsY2);
			devY3 = parseInt(devQaY3 + devLowerIncidentsY3);

			devTotal = devY1 + devY2 + devY3;

			//console.log("dev total is " + devTotal);
			
			//OPERATIONS - total

			operationsY1 = parseInt(opsIncidentCostY1 + effortSavingY1 + existingy1);
			operationsY2 = parseInt(opsIncidentCostY2 + effortSavingY2 + existingy2);
			operationsY3 = parseInt(opsIncidentCostY3 + effortSavingY3 + existingy3);

			operationsTotal = operationsY1 + operationsY2 + operationsY3;

			//console.log("ops total is " + operationsTotal);
			
			//BUSINESS - total
			revenueGainY1 = parseInt(revenueDowntimeY1 + revenueConversionY1);
			revenueGainY2 = parseInt(revenueDowntimeY2 + revenueConversionY2);
			revenueGainY3 = parseInt(revenueDowntimeY3 + revenueConversionY3);
			revenueGainTotal = revenueGainY1 + revenueGainY2 + revenueGainY3;

			//console.log("biz total is " + revenueGainTotal);
			
				var year1BenefitTotal = devY1 + operationsY1 + revenueGainY1;
				var year2BenefitTotal = devY2 + operationsY2 + revenueGainY2;
				var year3BenefitTotal = devY3 + operationsY3 + revenueGainY3;

				if(items[i].y1_software == "") {
					y1_software = 0;
				}
				else {
					y1_software = parseInt(getNumbers(items[i].y1_software));
				}

				if(items[i].y2_software == "") {
					y2_software = 0;
				}
				else {
					y2_software = parseInt(getNumbers(items[i].y2_software));
				}

				if(items[i].y3_software == "") {
					y3_software = 0;
				}
				else {
					y3_software = parseInt(getNumbers(items[i].y3_software));
				}

				if(items[i].y1_services == "") {
					y1_services = 0;
				}
				else {
					y1_services = parseInt(getNumbers(items[i].y1_services));
				}

				if(items[i].y2_services == "") {
					y2_services = 0;
				}
				else {
					y2_services = parseInt(getNumbers(items[i].y2_services));
				}

				if(items[i].y3_services == "") {
					y3_services = 0;
				}
				else {
					y3_services = parseInt(getNumbers(items[i].y3_services));
				}

				var year1CostTotal = y1_software + y1_services;

				if(isNaN(year1CostTotal) == true) {
					year1CostTotal = 0;
				}

				var year2CostTotal = y2_software + y2_services;

				if(isNaN(year2CostTotal) == true) {
					year2CostTotal = 0;
				}

				var year3CostTotal = y3_software + y3_services;

				if(isNaN(year3CostTotal) == true) {
					year3CostTotal = 0;
				}

				//DRAW ROI TABLE - costs

				//DRAW ROI TABLE - benefits

				//COST BENEFIT TOTAL

				var roi = ((year1BenefitTotal + year2BenefitTotal + year3BenefitTotal) / (year1CostTotal + year2CostTotal + year3CostTotal)) * 100;

				var payback = year1CostTotal / (year1BenefitTotal/12);

				//console.log("ROI is " + roi);
				//console.log("payback is " + payback);						
						
				
				if (revenueDowntimeTotal > 0 && revenueDowntimeTotal < 10000000) {revenueDowntimeTotalNum++; revenueDowntimeTot += revenueDowntimeTotal};

				if (revenueConversionTotal > 0 && revenueConversionTotal < 10000000) {revenueConversionTotalNum++; revenueConversionTot += revenueConversionTotal};
				
				
				if (existingTotal > 0 && existingTotal < 10000000) {existingTotalNum++; existingTot += existingTotal};
				
				if (opsIncidentCostTotal > 0 && opsIncidentCostTotal < 10000000) {opsIncidentCostTotalNum++; opsIncidentCostTot += opsIncidentCostTotal};	

				if (effortSavingTotal > 0 && effortSavingTotal < 10000000) {effortSavingTotalNum++; effortSavingTot += effortSavingTotal};					


				if (devQaTotal > 0 && devQaTotal < 10000000) {devQaTotalNum++; devQaTot += devQaTotal};					

				if (devLowerIncidentsTotal > 0 && devLowerIncidentsTotal < 10000000) {devLowerIncidentsTotalNum++; devLowerIncidentsTot += devLowerIncidentsTotal};					
				
				// existingTotalNum = 0;	
				// opsIncidentCostTotalNum = 0;	
				// effortSavingTotalNum = 0;	
				
				// devQaTotalNum = 0;	
				// devLowerIncidentsTotalNum = 0;	
				
				
				
				// revenueDowntimeTot = 0;
				// revenueConversionTot = 0;
			
				// existingTot = 0;
				// opsIncidentCostTot = 0;
				// effortSavingTot = 0;
			
				// devQaTot = 0;
				// devLowerIncidentsTot = 0;	
				
						
						
			}	
						revDown = revenueDowntimeTot / revenueDowntimeTotalNum;
						revConv = revenueConversionTot / revenueConversionTotalNum;
						
						existing = existingTot / existingTotalNum;
						opsIncident = opsIncidentCostTot / opsIncidentCostTotalNum;
						effortSav = effortSavingTot / effortSavingTotalNum;
						
						devQas = devQaTot / devQaTotalNum;
						devLower = devLowerIncidentsTot / devLowerIncidentsTotalNum;
						
						console.log("avg rev down is " + revDown);
						console.log("avg rev conv is " + revConv);
						
						console.log("avg existing is " + existing);
						console.log("avg ops incident is " + opsIncident);
						console.log("avg effort sav is " + effortSav);
						
						console.log("avg dev time is " + devQas);
						console.log("avg dev lower is " + devLower);
						
						
						
						
						
						
						
							res.end("hello");
						}
					})
		})
	
	
	
		

	});	

};
