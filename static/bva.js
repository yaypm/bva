function getNumbers(txt) {
	if (txt != "") {
		var numb = txt.match(/\d/g);
		numb = numb.join("");	
		
		return numb;
	}
	
	else {
		return "";
	}
}

function getNumbersAndDots(txt) {
	if (txt != "") {
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

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function getGet(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(results != null) {
		return results[1] || 0;
	}	
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function generateId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 16; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}	

function resizeOps() {
	setTimeout(function(){ $(".leftContainer").css("height", $('.ops').css('height')); }, 100);
}

function processMoney(preMoney) {
	if(preMoney != '' && preMoney != undefined) {preMoney = document.getElementById("currency").value + parseInt(getNumbers(preMoney)).toLocaleString(); temp = preMoney; preMoney = ''; preMoney = temp; return preMoney} else {preMoney = ''; return preMoney}
}

function processPercent(prePercent) {
	if(prePercent != '' && prePercent != undefined) {prePercent = getNumbersAndDots(prePercent) + '%'; temp = prePercent; prePercent = ''; prePercent = temp; return prePercent;} else {prePercent = ''; return prePercent;}
}

function processNumber(preNumber){
	if(preNumber != '' && preNumber != undefined) {preNumber = parseInt(getNumbers(preNumber)).toLocaleString(); temp = preNumber; preNumber = ''; preNumber = temp; return preNumber; } else {preNumber = ''; return preNumber;}
}

function statusDetect() {
	fail = getGet('status');
	if(fail == "failed") {
		$(".status-failure").css("display", "block");
	}
	if(fail == "success") {
		$(".status-success").css("display", "block");
	}	
}

function setFormLocation() {
	token = getGet('token');
	document.getElementById("reset").action="/resetyourpassword?token=" + token;	
}

function setEditLocation() {
	id = getGet('bva_id');
	document.getElementById("edit").action="/editbva?bva_id=" + id;	
}

function setShareLocation() {
	id = getGet('bva_id');
	document.getElementById("share").action="/sharebva?bva_id=" + id;	
}

function setEditLocation() {
	id = getGet('bva_id');
	document.getElementById("edit").action="/editbva?bva_id=" + id;	
}

function enableUserSearch() {
	$(" #user_search ").click(function() {
		$(".status-success").css("display", "none");
		$(".status-failure").css("display", "none");
		$(".status-success").css("display", "none");
		$(".status-failure").css("display", "none");
		userSearch();
	});
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function openReport() {
	bva_id = getGet('bva_id');
	url = ('/report?bva_id=' + bva_id);
	var win = window.open(url, '_blank');
	win.focus();
}

function setBvaLinks() {
	id = document.getElementById("bva_select").value;
	shareHref = "/share?bva_id=" + id;
	editHref = "/edit?bva_id=" + id;
	document.getElementById("edit").href=editHref;
	document.getElementById("share").href=shareHref;
}

function getAssessmentForEdit() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/getAssessmentMetaData', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		document.getElementById("company").value=jsonResponse.company;
		document.getElementById("currency").value=jsonResponse.currency		
	})	
}

function addToMine(id) {
	company = document.getElementById(id).parentElement.parentElement.getElementsByTagName("h2")[0].innerHTML;
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	myHeaders.append("company", company);
	myHeaders.append("bva_id", id);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/giveMeBva', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		if(jsonResponse.status == "success") {
			scrollToTop();
			$(".share-success").css("display", "block");
		}
		if(jsonResponse.status == "fail") {
			scrollToTop();
			$(".share-failure").css("display", "block");
		}
	})	
}

function userSearch() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	searchEmail = document.getElementById("emailSearch").value;
	
	myHeaders.append("emailSearch", searchEmail);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
	}		
	
	fetch('/searchUsers', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
	
		if(jsonResponse.status == undefined) {
			$('#no_result').css("display","none");
			$('#user_list').css("display","block");
			
			var newHtml = "";
			var listId = [];
			
			for(i=0; i<jsonResponse.length; i++) {
				var newId = {
					id: jsonResponse[i]._id
				}
				
				listId.push(newId);
				
				if(jsonResponse[i].has_pricing == true) {
					pricingCheckYes = "selected=\"selected\"";
					pricingCheckNo = "";
				}
				
				else {
					pricingCheckYes = "";
					pricingCheckNo = "selected=\"selected\"";
				}
				
				if(jsonResponse[i].currency == "pound") { var currency = "&pound;" }
				if(jsonResponse[i].currency == "dollar") { var currency = "&dollar;" }
				if(jsonResponse[i].currency == "euro") { var currency = "&euro;" }
				
				newHtml += "<div class=\"searchResult\"><h2>" + jsonResponse[i].company + "</h2><div class=\"result-block\"><label for=\"currency\" class=\"label\" >Currency</label><input name=\"currency\" disabled type=\"text\" class=\"inputfield currency-result\" value=\"" + currency + "\"/></div><div class=\"result-block\"><label for=\"pricing\" class=\"label\">Seen pricing?</label><select class=\"select pricing-result\" name=\"" + jsonResponse[i]._id + "_pricing\"><option value=\"Yes\" " + pricingCheckYes + ">Yes</option><option value=\"No\" " + pricingCheckNo + ">No</option></select></div><div class=\"result-block\"><label for=\"add\" class=\"label\">Add to yours</label><button type=\"button\" class=\"btn btn--primary theme--dark add-button\" id=\"" + jsonResponse[i]._id + "\"><img src=\"/static/add-white.png\" height=\"40px\" width=\"40px\" /></button></div><br /><br /><div style=\"block\"><label for=\"sfdc\" class=\"label\">Salesforce link</label><input type=\"text\" class=\"inputfield sfdc-result\" placeholder=\"SFDC link\" name=\"" + jsonResponse[i]._id + "_sfdc\" value=\"" + jsonResponse[i].sfdc + "\"/><button id=\"landing_box_password\" type=\"button\" class=\"btn btn--secondary theme--dark landing-bva-button openlink sfdc-link\"><img src=\"/static/external-link-white.png\" height=\"40px\" width=\"40px\"/></button></div></div><br />";
			}
			
			document.getElementById("listOfIds").value=JSON.stringify(listId);
			document.getElementById("results").innerHTML = newHtml;
			
			$(" .openlink ").click(function() {
				
					url = this.parentElement.children[1].value;
					openInNewTab(url);
			});
			
			$(" .add-button ").click(function() {
				addToMine(this.id);			  
			});	
		
		}
		
		else {
			document.getElementById("listOfIds").value = "";
			$('#no_result').css("display", "block");
		}
	})	
}

function getAssessmentList() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/getAssessmentList', myInit)
		
	.then(function(response) {
		return response.json();
	})

	.then(function(jsonObj) {
		var newHTML = '';
		
		if(jsonObj.length < 1) {
			document.getElementById("bva_select").innerHTML = '<option value="">Create an assessment!</option>';
		}
		
		else {
			for(i=0;i<jsonObj.length;i++) {
				newHTML += '<option value="' + jsonObj[i].id + '">' + jsonObj[i].company + '</option>';
			}
		
			document.getElementById("bva_select").innerHTML = newHTML;
			setBvaLinks();
		}
	})
}

function getAssessmentData() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/getAssessmentData', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		document.getElementById("company_revenue").value = processMoney(jsonResponse.company_revenue);
		document.getElementById("projected_growth").value = processPercent(jsonResponse.projected_growth);
		document.getElementById("revenue_dependent").value = processPercent(jsonResponse.revenue_dependent);
		document.getElementById("app_uptime").value = processPercent(jsonResponse.app_uptime);
		document.getElementById("revenue_breach").value = processPercent(jsonResponse.revenue_breach);
		document.getElementById("incidents_month").value = processNumber(jsonResponse.incidents_month);
		document.getElementById("no_ops_troubleshoot").value = processNumber(jsonResponse.no_ops_troubleshoot);
		document.getElementById("no_dev_troubleshoot").value = processNumber(jsonResponse.no_dev_troubleshoot);
		document.getElementById("mttr").value = processNumber(jsonResponse.mttr);
		document.getElementById("no_apps_e2e").value = processNumber(jsonResponse.no_apps_e2e);
		document.getElementById("no_t1t2_apps").value = processNumber(jsonResponse.no_t1t2_apps);
		document.getElementById("no_fte_existing").value = processNumber(jsonResponse.no_fte_existing);
		document.getElementById("cycles_per_year").value = processNumber(jsonResponse.cycles_per_year);
		document.getElementById("cycle_days").value = processNumber(jsonResponse.cycle_days);
		document.getElementById("test_per_cycle").value = processPercent(jsonResponse.test_per_cycle);
		document.getElementById("qa_time_per_cycle").value = processPercent(jsonResponse.qa_time_per_cycle);
		document.getElementById("qa_people_per_cycle").value = processNumber(jsonResponse.qa_people_per_cycle);
		document.getElementById("dev_time_per_cycle").value = processPercent(jsonResponse.dev_time_per_cycle);
		document.getElementById("dev_people_per_cycle").value = processNumber(jsonResponse.dev_people_per_cycle);
		document.getElementById("operation_cost").value = processMoney(jsonResponse.operation_cost);
		document.getElementById("developer_cost").value = processMoney(jsonResponse.developer_cost);
		document.getElementById("qa_cost").value = processMoney(jsonResponse.qa_cost);
		document.getElementById("work_hours").value = processNumber(jsonResponse.work_hours);
		document.getElementById("benefit_conversion").value = processPercent(jsonResponse.benefit_conversion);
		document.getElementById("benefit_incident_reduction").value = processPercent(jsonResponse.benefit_incident_reduction);
		document.getElementById("benefit_mttr").value = processPercent(jsonResponse.benefit_mttr);
		document.getElementById("benefit_performance").value = processPercent(jsonResponse.benefit_performance);
		document.getElementById("benefit_alert_storm").value = processPercent(jsonResponse.benefit_alert_storm);
		document.getElementById("benefit_sla").value = processPercent(jsonResponse.benefit_sla);
		document.getElementById("benefit_fix_qa").value = processPercent(jsonResponse.benefit_fix_qa);
		document.getElementById("benefit_prod_reduction").value = processPercent(jsonResponse.benefit_prod_reduction);
		document.getElementById("benefit_config").value = processPercent(jsonResponse.benefit_config);
		document.getElementById("y1_software").value = processMoney(jsonResponse.y1_software);
		document.getElementById("y1_services").value = processMoney(jsonResponse.y1_services);
		document.getElementById("y2_software").value = processMoney(jsonResponse.y2_software);
		document.getElementById("y2_services").value = processMoney(jsonResponse.y2_services);
		document.getElementById("y3_software").value = processMoney(jsonResponse.y3_software);
		document.getElementById("y3_services").value = processMoney(jsonResponse.y3_services);		
		
		existingApps = "";
		
		var currency = document.getElementById("currency").value;
		
		for(i=0;i<jsonResponse.existing_apps.length;i++) {
			existingApps += "<div class=\"bva-question-wrapper bva-question-top \" \"><div class=\"bva-question-existing-wrapper\">	<div style=\"position: relative\"> <h2 style=\"display: inline-block\">" + jsonResponse.existing_apps[i].name + "</h2> <div style=\"display: inline-block; position: absolute; right: 0px\"><a class=\"delete\" id=\"" + jsonResponse.existing_apps[i].tool_id + "\"><img src=\"/static/delete-grey.svg\"  width=\"40px\" height=\"40px\" /></a></div> </div><p>" + currency + parseInt(jsonResponse.existing_apps[i].annual_costs).toLocaleString() + " - " + jsonResponse.existing_apps[i].ftes + " FTEs</p><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 1: " + jsonResponse.existing_apps[i].y1 + "%</label><progress class=\"progressbar\" value=\"" + jsonResponse.existing_apps[i].y1 + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 2: " + jsonResponse.existing_apps[i].y2 + "%</label><progress class=\"progressbar\" value=\"" + jsonResponse.existing_apps[i].y2 + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 3: " + jsonResponse.existing_apps[i].y3 + "%</label><progress class=\"progressbar\" value=\"" + jsonResponse.existing_apps[i].y3 + "\" max=\"100\" id=\"p0\"></progress></div>	</div></div><br />";
		}			
		
		document.getElementById("existing_apps").innerHTML = existingApps;
		
		$(" .delete ").click(function() {

			deleteExistingTool(this.id);

		});	

		drawResults();
	})
}	

function updateAssessment() {
	var assessment_data = {
		company_revenue: getNumbers(document.getElementById("company_revenue").value),
		projected_growth: getNumbersAndDots(document.getElementById("projected_growth").value),
		revenue_dependent: getNumbersAndDots(document.getElementById("revenue_dependent").value),
		app_uptime: getNumbersAndDots(document.getElementById("app_uptime").value),
		revenue_breach: getNumbers(document.getElementById("revenue_breach").value),
		incidents_month: getNumbers(document.getElementById("incidents_month").value),
		no_ops_troubleshoot: getNumbers(document.getElementById("no_ops_troubleshoot").value),
		no_dev_troubleshoot: getNumbers(document.getElementById("no_dev_troubleshoot").value),
		mttr: getNumbers(document.getElementById("mttr").value),
		no_apps_e2e: getNumbers(document.getElementById("no_apps_e2e").value),
		no_t1t2_apps: getNumbers(document.getElementById("no_t1t2_apps").value),
		no_fte_existing: getNumbers(document.getElementById("no_fte_existing").value),
		existing_apps: [],
		cycles_per_year: getNumbers(document.getElementById("cycles_per_year").value),
		cycle_days: getNumbers(document.getElementById("cycle_days").value),
		test_per_cycle: getNumbersAndDots(document.getElementById("test_per_cycle").value),
		qa_time_per_cycle: getNumbersAndDots(document.getElementById("qa_time_per_cycle").value),
		qa_people_per_cycle: getNumbers(document.getElementById("qa_people_per_cycle").value),
		dev_time_per_cycle: getNumbersAndDots(document.getElementById("dev_time_per_cycle").value),
		dev_people_per_cycle: getNumbers(document.getElementById("dev_people_per_cycle").value),
		operation_cost: getNumbers(document.getElementById("operation_cost").value),
		developer_cost: getNumbers(document.getElementById("developer_cost").value),
		qa_cost: getNumbers(document.getElementById("qa_cost").value),
		work_hours: getNumbers(document.getElementById("work_hours").value),
		benefit_conversion: getNumbersAndDots(document.getElementById("benefit_conversion").value),
		benefit_incident_reduction: getNumbersAndDots(document.getElementById("benefit_incident_reduction").value),
		benefit_mttr: getNumbersAndDots(document.getElementById("benefit_mttr").value),
		benefit_performance: getNumbersAndDots(document.getElementById("benefit_performance").value),
		benefit_alert_storm: getNumbersAndDots(document.getElementById("benefit_alert_storm").value),
		benefit_sla: getNumbersAndDots(document.getElementById("benefit_sla").value),
		benefit_fix_qa: getNumbersAndDots(document.getElementById("benefit_fix_qa").value),
		benefit_prod_reduction: getNumbersAndDots(document.getElementById("benefit_prod_reduction").value),
		benefit_config: getNumbersAndDots(document.getElementById("benefit_config").value),
		y1_software: getNumbers(document.getElementById("y1_software").value),
		y1_services: getNumbers(document.getElementById("y1_services").value),
		y2_software: getNumbers(document.getElementById("y2_software").value),
		y2_services: getNumbers(document.getElementById("y2_services").value),
		y3_software: getNumbers(document.getElementById("y3_software").value),
		y3_services: getNumbers(document.getElementById("y3_services").value)	
	}
		
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(assessment_data)
	}		
	
	fetch('/updateAssessment', myInit)
		
	.then(function(response) {
	
	})
}

function addListeners() {
	
	getTabs();
	
	$(".leftContainer").css("height", $('.biz').css('height'));
	
	$("#existingToolAdd").click(function() {
		addExistingTool(); 	  	  
	});		
	
	$(" .opsFromBiz ").click(function() {
		$( ".biz" ).hide('slide', {direction: 'left'});
		$(".ops").fadeIn();
		$(".leftContainer").css("height", $('.ops').css('height')); 
		$( ".result-biz" ).hide('slide', {direction: 'left'});
		$(".result-ops").fadeIn();		 
		getAssessmentData();		
	});	
		
	$(" .bizFromOps ").click(function() {
		$( ".ops" ).toggle( "slide" , { direction: "right" });
		$( ".biz" ).fadeIn();	
		$(".leftContainer").css("height", $('.biz').css('height'));
		$( ".result-ops" ).toggle( "slide" , { direction: "right" });
		$( ".result-biz" ).fadeIn();
		getAssessmentData();	
	});	
		
	$(" .devFromOps ").click(function() {
		$( ".ops" ).toggle( "slide" , { direction: "left" });
		$( ".dev" ).fadeIn();		
		$(".leftContainer").css("height", $('.dev').css('height'));
		$( ".result-ops" ).toggle( "slide" , { direction: "left" });
		$( ".result-dev" ).fadeIn();		
		getAssessmentData();
	});	
		
	$(" .opsFromDev ").click(function() {
		$( ".dev" ).toggle( "slide" , { direction: "right" });
		$( ".ops" ).fadeIn();	
		$(".leftContainer").css("height", $('.ops').css('height'));
		$( ".result-dev" ).toggle( "slide" , { direction: "right" });
		$( ".result-ops" ).fadeIn();
		getAssessmentData();
	});	

	$(" .optionsFromDev ").click(function() {
		$( ".dev" ).toggle( "slide" , { direction: "left" });
		$( ".options" ).fadeIn();	
		$(".leftContainer").css("height", $('.options').css('height'));
		$( ".result-dev" ).toggle( "slide" , { direction: "left" });
		$( ".result-options" ).fadeIn();
		getAssessmentData();
	});	

	$(" .devFromOptions ").click(function() {
		$( ".options" ).toggle( "slide" , { direction: "right" });
		$( ".dev" ).fadeIn();		
		$(".leftContainer").css("height", $('.dev').css('height'));
		$( ".result-options" ).toggle( "slide" , { direction: "right" });
		$( ".result-dev" ).fadeIn();
		getAssessmentData();
	});	
		
	$('#company_revenue, #operation_cost, #developer_cost, #qa_cost, #annual_cost, #y1_software, #y1_services, #y2_software, #y2_services, #y3_software, #y3_services').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = document.getElementById("currency").value + parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		updateAssessment();
		drawResults();
	} );
		
	$('#projected_growth, #revenue_breach, #revenue_dependent, #app_uptime, #test_per_cycle, #qa_time_per_cycle, #dev_time_per_cycle, #benefit_conversion, #benefit_incident_reduction, #benefit_mttr, #benefit_performance, #benefit_alert_storm, #benefit_sla, #benefit_fix_qa, #benefit_prod_reduction, #benefit_config, #existing_y1, #existing_y2, #existing_y3').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		updateAssessment();
		drawResults();
	} );
		
	$('#incidents_month, #no_ops_troubleshoot, #no_dev_troubleshoot, #mttr, #no_apps_e2e, #no_t1t2_apps, #no_fte_existing, #cycles_per_year, #cycle_days, #qa_people_per_cycle, #dev_people_per_cycle, #work_hours, #no_fte_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		updateAssessment();
		drawResults();		
	});
	
	$("#open-report").click(function() {
		openReport();
	});
}

function getTabs() {
	bva_id = getGet('bva_id');
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/getUserDetails', myInit)
		
	.then(function(response) {
		return response.json();
	})	
	
	.then(function(jsonObj) {
		if(jsonObj.currency == "pound") { var currency = "£" }
		if(jsonObj.currency == "dollar") { var currency = "$" }
		if(jsonObj.currency == "euro") { var currency = "€" }		
		
		document.getElementById("currency").value=currency;
		
		document.getElementsByClassName("user-email")[0].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[0].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[1].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[1].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[2].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[2].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[3].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[3].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;		
		
		if(jsonObj.has_pricing == true) {
			$('#pricing').css("display", "block");
		}
		
		getAssessmentData();	
		
	})
}

function addExistingTool() {
	
	var tool_id = generateId();
	
	var existingTool = {
		tool_id: tool_id,
		name_tool: document.getElementById("name_tool").value,
		annual_cost: getNumbers(document.getElementById("annual_cost").value),
		no_fte_config: getNumbers(document.getElementById("no_fte_config").value),
		existing_y1: getNumbers(document.getElementById("existing_y1").value),
		existing_y2: getNumbers(document.getElementById("existing_y2").value),
		existing_y3: getNumbers(document.getElementById("existing_y3").value),
	}
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(existingTool)
	}		
	
	fetch('/addExistingTool', myInit)
	
	.then(function() {
		
		var newApp = "<div class=\"bva-question-wrapper bva-question-top \" \"><div class=\"bva-question-existing-wrapper\">	<div style=\"position: relative\"> <h2 style=\"display: inline-block\">" + document.getElementById("name_tool").value + "</h2> <div style=\"display: inline-block; position: absolute; right: 0px\"><a class=\"delete\" id=\"" + tool_id + "\"><img src=\"/static/delete-grey.svg\"  width=\"40px\" height=\"40px\" /></a></div> </div><p>" + document.getElementById("annual_cost").value + " - " + document.getElementById("no_fte_config").value + " FTEs</p><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 1: " + document.getElementById("existing_y1").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y1").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 2: " + document.getElementById("existing_y2").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y2").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 3: " + document.getElementById("existing_y3").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y3").value) + "\" max=\"100\" id=\"p0\"></progress></div>	</div></div><br />";
		
		$( "#existing_apps" ).append( newApp );
		$(".leftContainer").css("height", $('.ops').css('height'));
		
		$(" .delete ").click(function() {
			deleteExistingTool(this.id);
		});
		
		document.getElementById("name_tool").value = "";
		document.getElementById("annual_cost").value = "";
		document.getElementById("no_fte_config").value = "";
		document.getElementById("existing_y1").value = "";
		document.getElementById("existing_y2").value = "";
		document.getElementById("existing_y3").value = "";	

		drawResults();
	})

}

function deleteExistingTool(id) {
	
	var existing_id = {
		id: id
	}
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(existing_id)
	}		
	
	fetch('/deleteExistingTool', myInit)
		
	.then(function(response) {
		$("#" + id).parent().parent().parent().parent().remove();
		$(".leftContainer").css("height", $('.ops').css('height'));
		
		drawResults();
	})
}

function confirmDelete() {
	$("#edit_box_submit").fadeOut();
	$("#confirmDelete").fadeIn();
}

function cancelDelete() {
	$("#edit_box_submit").fadeIn();
	$("#confirmDelete").fadeOut();
}

function addDeleteId() {
	id = getGet('bva_id');
	document.getElementById("finalDelete").href="/deleteAssessment?bva_id=" + id;
}

function deleteAssessment() {
	
	var tool_id = generateId();
	
	var existingTool = {
		tool_id: tool_id,
		name_tool: document.getElementById("name_tool").value,
		annual_cost: getNumbers(document.getElementById("annual_cost").value),
		no_fte_config: getNumbers(document.getElementById("no_fte_config").value),
		existing_y1: getNumbers(document.getElementById("existing_y1").value),
		existing_y2: getNumbers(document.getElementById("existing_y2").value),
		existing_y3: getNumbers(document.getElementById("existing_y3").value),
	}
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(existingTool)
	}		
	
	fetch('/addExistingTool', myInit)
	
	.then(function() {
		
		var newApp = "<div class=\"bva-question-wrapper bva-question-top \" \"><div class=\"bva-question-existing-wrapper\">	<div style=\"position: relative\"> <h2 style=\"display: inline-block\">" + document.getElementById("name_tool").value + "</h2> <div style=\"display: inline-block; position: absolute; right: 0px\"><a class=\"delete\" id=\"" + tool_id + "\"><img src=\"/static/delete-grey.svg\"  width=\"40px\" height=\"40px\" /></a></div> </div><p>" + document.getElementById("annual_cost").value + " - " + document.getElementById("no_fte_config").value + " FTEs</p><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 1: " + document.getElementById("existing_y1").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y1").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 2: " + document.getElementById("existing_y2").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y2").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 3: " + document.getElementById("existing_y3").value + "</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y3").value) + "\" max=\"100\" id=\"p0\"></progress></div>	</div></div><br />";
		
		$( "#existing_apps" ).append( newApp );
		$(".leftContainer").css("height", $('.ops').css('height'));
		
		$(" .delete ").click(function() {
			deleteExistingTool(this.id);
		});
		
		document.getElementById("name_tool").value = "";
		document.getElementById("annual_cost").value = "";
		document.getElementById("no_fte_config").value = "";
		document.getElementById("existing_y1").value = "";
		document.getElementById("existing_y2").value = "";
		document.getElementById("existing_y3").value = "";	

	})

}

function drawResults() {
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	bva_id = getGet('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}		
	
	fetch('/getAssessmentData', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {
		
			//OPERATIONS - get rid of tools
			if(jsonResponse.existing_apps.length == 0) {
					existingy1 = 0;
					existingy2 = 0;
					existingy3 = 0;
					existingTotal = 0;
					
					document.getElementById("ops-reduced-tools").innerHTML="";	

					var opsCase1 = 0;			
			}
			
			else {
				number = jsonResponse.existing_apps.length;
				
				var existingy1 = 0; 
				var existingy2 = 0; 
				var existingy3 = 0;
				
				for(i=0;i<number;i++) {
					annual_cost = (parseInt(jsonResponse.existing_apps[i].annual_costs)) + (parseInt(jsonResponse.existing_apps[i].ftes) * parseInt(jsonResponse.operation_cost));
					percent1 = (parseInt(jsonResponse.existing_apps[i].y1)/100);
					percent2 = (parseInt(jsonResponse.existing_apps[i].y2)/100);
					percent3 = (parseInt(jsonResponse.existing_apps[i].y3)/100);
					existingy1 = parseInt(existingy1 + (annual_cost * percent1)); 
					existingy2 = parseInt(existingy2 + (annual_cost * percent2)); 
					existingy3 = parseInt(existingy3 + (annual_cost * percent3)); 
					existingTotal = existingy1 + existingy2 + existingy3;
				}
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-reduced-tools.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Reduction of existing monitoring tools</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(existingTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("ops-reduced-tools").innerHTML=newHtml;			
			}	
		
			//BUSINESS - revenue increase
			revenue = parseInt(getNumbers(document.getElementById("company_revenue").value));

			percent = parseInt(getNumbers(document.getElementById("revenue_dependent").value));
			percent = percent / 100;

			growth = parseInt(getNumbers(document.getElementById("projected_growth").value));
			growth = growth / 100;
			
			uptime = parseFloat(getNumbersAndDots(document.getElementById("app_uptime").value));
			uptime = uptime / 100;

			breach = parseFloat(getNumbersAndDots(document.getElementById("revenue_breach").value));
			breach = breach / 100;
			
			benefit_sla = parseInt(getNumbers(document.getElementById("benefit_sla").value));
			benefit_sla = benefit_sla / 100;

			if(isNaN(revenue) == true || revenue == 0 || isNaN(percent) == true || percent == 0 || isNaN(growth) == true || growth == 0 || isNaN(uptime) == true || uptime == 0 || isNaN(breach) == true || breach == 0 || isNaN(benefit_sla) == true || benefit_sla == 0) {
				revenueDowntimeY1 = 0;
				revenueDowntimeY2 = 0;
				revenueDowntimeY3 = 0;
				revenueDowntimeTotal = 0;
				
				document.getElementById("biz-increased-revenue").innerHTML="";	

				var bizCase1 = 0;
			}
			
			else {
				revenueLost = ((revenue * percent)/8760)*(8760*(1-uptime))*breach;
				
				revenueDowntimeY1 = parseInt(revenueLost * benefit_sla);
				revenueDowntimeY2 = parseInt(revenueDowntimeY1 * (1+growth));
				revenueDowntimeY3 = parseInt(revenueDowntimeY2 * (1+growth));
				revenueDowntimeTotal = revenueDowntimeY1 + revenueDowntimeY2 + revenueDowntimeY3;
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/biz-increased-revenue.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Revenue gained by reduced incidents, downtime, and slowness</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(revenueDowntimeTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("biz-increased-revenue").innerHTML=newHtml;		

				var bizCase1 = 1;
				
				if($('#business').css('display') == "none") {
					$('#business').fadeIn(); 
				}				
			}
			
			//BUSINESS - conversions
			revenue = parseInt(getNumbers(document.getElementById("company_revenue").value));

			percent = parseInt(getNumbers(document.getElementById("revenue_dependent").value));
			percent = percent / 100;

			conversion = parseFloat(getNumbersAndDots(document.getElementById("benefit_conversion").value));
			conversion = conversion / 100;
			
			growth = parseInt(getNumbers(document.getElementById("projected_growth").value));
			growth = growth / 100;			
			
			if(isNaN(revenue) == true || revenue == 0 || isNaN(percent) == true || percent == 0 || isNaN(conversion) == true || conversion == 0 || isNaN(growth) == true || growth == 0) {
				revenueConversionY1 = 0;
				revenueConversionY2 = 0;
				revenueConversionY3 = 0;
				revenueConversionTotal = 0;
				
				document.getElementById("biz-increased-conversions").innerHTML="";	
				
				var bizCase2 = 0;
			}
			
			else {
				revenueConversionY1 = parseInt((revenue * percent) * conversion);
				revenueConversionY2 = parseInt(revenueConversionY1 * (1+growth));
				revenueConversionY3 = parseInt(revenueConversionY2 * (1+growth));
				revenueConversionTotal = revenueConversionY1 + revenueConversionY2 + revenueConversionY3;
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/biz-increased-conversions.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Revenue from increased conversions caused by better user experience and app performance</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(revenueConversionTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("biz-increased-conversions").innerHTML=newHtml;		

				if($('#business').css('display') == "none") {
					$('#business').fadeIn(); 
				}
				
				var bizCase2 = 1;
			}
			
			if(bizCase1 + bizCase2 == 0) {
				$('#business').fadeOut();
			}
			
			//OPERATIONS - incident reduction
			incidents_month = parseInt(getNumbers(document.getElementById("incidents_month").value));
			
			growth = parseInt(getNumbers(document.getElementById("projected_growth").value));
			growth = growth / 100;	
			
			no_ops_troubleshoot = parseInt(getNumbers(document.getElementById("no_ops_troubleshoot").value));
			
			no_dev_troubleshoot = parseInt(getNumbers(document.getElementById("no_dev_troubleshoot").value));
			
			mttr = parseInt(getNumbers(document.getElementById("mttr").value));
			
			benefit_incident_reduction = parseInt(getNumbers(document.getElementById("benefit_incident_reduction").value));
			
			benefit_incident_reduction = benefit_incident_reduction / 100;
			
			benefit_mttr = parseInt(getNumbers(document.getElementById("benefit_mttr").value));
			benefit_mttr = benefit_mttr / 100;
			
			ops_cost = parseInt(getNumbers(document.getElementById("operation_cost").value));
			
			dev_cost = parseInt(getNumbers(document.getElementById("developer_cost").value));
			
			work_hours = parseInt(getNumbers(document.getElementById("work_hours").value));
			
			if(isNaN(incidents_month) == true || incidents_month == 0 || isNaN(growth) == true || growth == 0 || isNaN(no_ops_troubleshoot) == true || isNaN(no_dev_troubleshoot) == true || isNaN(mttr) == true || mttr == 0 || isNaN(benefit_incident_reduction) == true || benefit_incident_reduction == 0 || isNaN(benefit_mttr) == true || benefit_mttr == 0 || isNaN(ops_cost) == true || ops_cost == 0 || isNaN(dev_cost) == true || dev_cost == 0 || isNaN(work_hours) == true || work_hours == 0) {
				opsIncidentCostY1 = 0;
				opsIncidentCostY2 = 0;
				opsIncidentCostY3 = 0;
				opsIncidentCostTotal = 0;
				
				document.getElementById("ops-reduced-incidents").innerHTML="";	
				
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
				
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-reduced-incidents.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Incident reduction and faster MTTR in production (cost of war room effort)</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(opsIncidentCostTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("ops-reduced-incidents").innerHTML=newHtml;	

				if($('#operations').css('display') == "none") {
					$('#operations').fadeIn(); 
				}
				
				var opsCase2 = 1;				
			}
			
			//OPERATIONS - cost of automation
			no_fte_existing = parseInt(getNumbers(document.getElementById("no_fte_existing").value));
			
			no_apps_e2e = parseInt(getNumbers(document.getElementById("no_apps_e2e").value));
			
			no_t1t2_apps = parseInt(getNumbers(document.getElementById("no_t1t2_apps").value));
			
			benefit_config = parseInt(getNumbers(document.getElementById("benefit_config").value));	
			benefit_config = benefit_config / 100;	

			if(isNaN(no_fte_existing) == true || no_fte_existing == 0 || isNaN(no_apps_e2e) == true || no_apps_e2e == 0 || isNaN(no_t1t2_apps) == true || no_t1t2_apps == 0 || isNaN(benefit_config) == true || benefit_config == 0) {
				effortSavingY1 = 0;
				effortSavingY2 = 0;
				effortSavingY3 = 0;
				effortSavingTotal = 0;
				
				document.getElementById("ops-increased-automation").innerHTML="";	
				
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
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-increased-automation.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Cost savings with Dynatrace automation vs. manual effort </p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(effortSavingTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("ops-increased-automation").innerHTML=newHtml;	

				if($('#operations').css('display') == "none") {
					$('#operations').fadeIn(); 
				}
					
				var opsCase3 = 1;			

			}	
			
			if(opsCase1 + opsCase2 + opsCase3 == 0) {
				$('#operations').fadeOut();
			}
			
			//DEV AND QA - effort
			
			cycles_per_year = parseInt(getNumbers(document.getElementById("cycles_per_year").value));
			
			cycle_days = parseInt(getNumbers(document.getElementById("cycle_days").value));

			test_per_cycle = parseInt(getNumbers(document.getElementById("test_per_cycle").value));
			test_per_cycle = test_per_cycle / 100;

			qa_time_per_cycle = parseInt(getNumbers(document.getElementById("qa_time_per_cycle").value));	
			qa_time_per_cycle = qa_time_per_cycle / 100;

			qa_people_per_cycle = parseInt(getNumbers(document.getElementById("qa_people_per_cycle").value));	

			dev_time_per_cycle = parseInt(getNumbers(document.getElementById("dev_time_per_cycle").value));	
			dev_time_per_cycle = dev_time_per_cycle / 100;
			
			dev_people_per_cycle = parseInt(getNumbers(document.getElementById("dev_people_per_cycle").value));
			
			benefit_fix_qa = parseInt(getNumbers(document.getElementById("benefit_fix_qa").value));
			benefit_fix_qa = benefit_fix_qa / 100;
			
			qa_cost = parseInt(getNumbers(document.getElementById("qa_cost").value));
			
			if(isNaN(cycles_per_year) == true || cycles_per_year == 0 || isNaN(cycle_days) == true || cycle_days == 0 || isNaN(test_per_cycle) == true || test_per_cycle == 0 || isNaN(qa_time_per_cycle) == true || qa_time_per_cycle == 0 || isNaN(qa_people_per_cycle) == true || qa_people_per_cycle == 0 || isNaN(dev_time_per_cycle) == true || dev_time_per_cycle == 0 || isNaN(dev_people_per_cycle) == true || dev_people_per_cycle == 0 || isNaN(benefit_fix_qa) == true || benefit_fix_qa == 0 || isNaN(qa_cost) == true || qa_cost == 0) {
				devQaY1 = 0;
				devQaY2 = 0;
				devQaY3 = 0;
				devQaTotal = 0;
				
				document.getElementById("dev-decreased-investigation").innerHTML="";	
				
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
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/dev-decreased-investigation.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Performance defect investigation and troubleshooting in QA</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devQaTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("dev-decreased-investigation").innerHTML=newHtml;	

				if($('#development').css('display') == "none") {
					$('#development').fadeIn(); 
				}
					
				var devCase1 = 1;					
			}
			//DEV AND QA - fewer incidents

			incidentsYear = incidents_month * 12;
			opsHours = incidentsYear * no_ops_troubleshoot * (mttr / 60);
			opsCost = opsHours * (ops_cost / work_hours);
			devHours = incidentsYear * no_dev_troubleshoot * (mttr / 60);
			devCost = devHours * (dev_cost / work_hours);
			incidentCost = opsCost + devCost;
			
			benefit_prod_reduction = parseInt(getNumbers(document.getElementById("benefit_prod_reduction").value));
			benefit_prod_reduction = benefit_prod_reduction / 100;
			
			if(isNaN(incidentsYear) == true || incidentsYear == 0 || isNaN(opsHours) == true || opsHours == 0 || isNaN(opsCost) == true || opsCost == 0 || isNaN(devHours) == true || devHours == 0 || isNaN(devCost) == true || devCost == 0 || isNaN(incidentCost) == true || incidentCost == 0 || isNaN(benefit_prod_reduction) == true || benefit_prod_reduction == 0 || isNaN(incidents_month) == true || incidents_month == 0 || isNaN(no_ops_troubleshoot) == true || no_ops_troubleshoot == 0 || isNaN(no_dev_troubleshoot) == true || no_dev_troubleshoot == 0 || isNaN(work_hours) == true || work_hours == 0 || isNaN(mttr) == true || mttr == 0 || isNaN(growth) == true || growth == 0) {
				devLowerIncidentsY1 = 0;
				devLowerIncidentsY2 = 0;
				devLowerIncidentsY3 = 0;
				devLowerIncidentsTotal = 0;
				
				document.getElementById("dev-decreased-incidents").innerHTML="";	
				
				var devCase2 = 0;				
			}
			
			else {
				devLowerIncidentsY1 = parseInt(incidentCost * benefit_prod_reduction);
				devLowerIncidentsY2 = parseInt(devLowerIncidentsY1 * (1+growth));
				devLowerIncidentsY3 = parseInt(devLowerIncidentsY2 * (1+growth));
				devLowerIncidentsTotal = devLowerIncidentsY1 + devLowerIncidentsY2 + devLowerIncidentsY3;
				
				var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/dev-decreased-incidents.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Fewer production incidents by finding & fixing performance defects in QA & Dev</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devLowerIncidentsTotal.toString()) + "</b></dd></dl></div></div>";
				
				document.getElementById("dev-decreased-incidents").innerHTML=newHtml;		
				if($('#development').css('display') == "none") {
					$('#development').fadeIn(); 
				}
					
				var devCase2 = 1;					
			}
			
			if(devCase1 + devCase2 == 0) {
				$('#development').fadeOut();
			}
			
			//DEV QA - total
			
			devY1 = parseInt(devQaY1 + devLowerIncidentsY1);
			devY2 = parseInt(devQaY2 + devLowerIncidentsY2);
			devY3 = parseInt(devQaY3 + devLowerIncidentsY3);
			
			devTotal = devY1 + devY2 + devY3;
			
			if(devTotal != 0){
				if(devTotal > 0  && document.getElementById("developmentRow") == null) {
					var table = document.getElementById("results_body");

					var row = table.insertRow(0);
					row.style.backgroundColor="#1496ff";
					row.style.color="white";
					row.setAttribute("id", "developmentRow");
					
					var title = row.insertCell(0);
					var year1 = row.insertCell(1);
					year1.setAttribute("id", "devYear1");
					var year2 = row.insertCell(2);
					year2.setAttribute("id", "devYear2");
					var year3 = row.insertCell(3);
					year3.setAttribute("id", "devYear3");
					var total = row.insertCell(4);
					total.setAttribute("id", "devTotal");

					title.innerHTML = "<img src=\"/static/dev.svg\" style=\"width: 20px; height: 20px\"> Development";
					year1.innerHTML = processMoney(devY1.toString());
					year2.innerHTML = processMoney(devY2.toString());
					year3.innerHTML = processMoney(devY3.toString());
					total.innerHTML = "<b>" + processMoney(devTotal.toString()) + "</b>";
				}
				
				else {
					document.getElementById("devYear1").innerHTML = processMoney(devY1.toString());
					document.getElementById("devYear2").innerHTML = processMoney(devY2.toString());
					document.getElementById("devYear3").innerHTML = processMoney(devY3.toString());
					document.getElementById("devTotal").innerHTML = processMoney(devTotal.toString());
				}
			}
			
			else {
				devYear1 = null;
				devYear2 = null;
				devYear3 = null;
				devTotal = null;
			}				
			
			
			//OPERATIONS - total
			
			operationsY1 = parseInt(opsIncidentCostY1 + effortSavingY1 + existingy1);
			operationsY2 = parseInt(opsIncidentCostY2 + effortSavingY2 + existingy2);
			operationsY3 = parseInt(opsIncidentCostY3 + effortSavingY3 + existingy3);
			
			operationsTotal = operationsY1 + operationsY2 + operationsY3;
			
			if(operationsTotal != 0){
				if(operationsTotal > 0  && document.getElementById("operationsRow") == null) {
					var table = document.getElementById("results_body");

					var row = table.insertRow(0);
					row.style.backgroundColor="#73be28";
					row.style.color="white";
					row.setAttribute("id", "operationsRow");
					
					var title = row.insertCell(0);
					var year1 = row.insertCell(1);
					year1.setAttribute("id", "opsYear1");
					var year2 = row.insertCell(2);
					year2.setAttribute("id", "opsYear2");
					var year3 = row.insertCell(3);
					year3.setAttribute("id", "opsYear3");
					var total = row.insertCell(4);
					total.setAttribute("id", "opsTotal");

					title.innerHTML = "<img src=\"/static/ops.svg\" style=\"width: 20px; height: 20px\"> Operations";
					year1.innerHTML = processMoney(operationsY1.toString());
					year2.innerHTML = processMoney(operationsY2.toString());
					year3.innerHTML = processMoney(operationsY3.toString());
					total.innerHTML = "<b>" + processMoney(operationsTotal.toString()) + "</b>";
				}

				else {
					document.getElementById("opsYear1").innerHTML = processMoney(operationsY1.toString());
					document.getElementById("opsYear2").innerHTML = processMoney(operationsY2.toString());
					document.getElementById("opsYear3").innerHTML = processMoney(operationsY3.toString());
					document.getElementById("opsTotal").innerHTML = processMoney(operationsTotal.toString());
				}
			}
			
			else {
				operationsY1 = null;
				operationsY2 = null;
				operationsY3 = null;
				operationsTotal = null;
			}			
			
			//BUSINESS - total
			revenueGainY1 = parseInt(revenueDowntimeY1 + revenueConversionY1);
			revenueGainY2 = parseInt(revenueDowntimeY2 + revenueConversionY2);
			revenueGainY3 = parseInt(revenueDowntimeY3 + revenueConversionY3);
			revenueGainTotal = revenueGainY1 + revenueGainY2 + revenueGainY3;
			
			if(revenueGainTotal != 0){
				if(revenueGainTotal > 0  && document.getElementById("businessRow") == null) {
					var table = document.getElementById("results_body");

					var row = table.insertRow(0);
					row.style.backgroundColor="#9355b7";
					row.style.color="white";
					row.setAttribute("id", "businessRow");
					
					var title = row.insertCell(0);
					var year1 = row.insertCell(1);
					year1.setAttribute("id", "bizYear1");
					var year2 = row.insertCell(2);
					year2.setAttribute("id", "bizYear2");
					var year3 = row.insertCell(3);
					year3.setAttribute("id", "bizYear3");
					var total = row.insertCell(4);
					total.setAttribute("id", "bizTotal");

					title.innerHTML = "<img src=\"/static/biz.svg\" style=\"width: 20px; height: 20px;\"> Business";
					year1.innerHTML = processMoney(revenueGainY1.toString());
					year2.innerHTML = processMoney(revenueGainY2.toString());
					year3.innerHTML = processMoney(revenueGainY3.toString());
					total.innerHTML = "<b>" + processMoney(revenueGainTotal.toString()) + "</b>";
				}
				
				else {
					document.getElementById("bizYear1").innerHTML = processMoney(revenueGainY1.toString());
					document.getElementById("bizYear2").innerHTML = processMoney(revenueGainY2.toString());
					document.getElementById("bizYear3").innerHTML = processMoney(revenueGainY3.toString());
					document.getElementById("bizTotal").innerHTML = processMoney(revenueGainTotal.toString());
				}
			}
			
			else {
				revenueGainY1 = null;
				revenueGainY2 = null;
				revenueGainY3 = null;
				revenueGainTotal = null;
			}
			
			//Something to draw?
			
			if ((devTotal + operationsTotal + revenueGainTotal) > 0) {
				$('#no-results').fadeOut();
				$('#results').fadeIn();
				$('#loading').fadeOut();
			}
			
			else {
				$('#no-results').fadeIn();
				$('#results').fadeOut();
				$('#loading').fadeOut();
			}
						
			
			//DRAW SUMMARY CHART
			var bar_chart = Highcharts.chart('total_stacked_bar', {
				colors: ['#1496ff','#73be28','#9355b7'],
				chart: {
					type: 'column',
					animation: 'false',
					style: {
						fontFamily: 'BerninaSans'
					}
				},
				exporting: {
					enabled: false
				},
				title: {
					text: '',
					align: 'left',
					margin: 30
				},
				credits: {
					enabled: false
				},
				xAxis: {
					categories: ['Year 1', 'Year 2', 'Year 3']
				},
				yAxis: {
					min: 0,
					title: {
							text: ''
					},
						stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						}
					}
				},
				legend: {
					align: 'center',
					verticalAlign: 'bottom',     
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
					borderColor: '#CCC',
					borderWidth: 0,
					shadow: false
				},
				tooltip: {
					enabled: false
				},
				plotOptions: {
					column: {
						stacking: 'normal',
						dataLabels: {
							enabled: true,
							color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
						},
					},
					series: {
						animation: false,
						borderWidth:0,
						pointPadding: 0,
						groupPadding: 0.1
					}
				},
				series: [{
					name: 'Development',
					data: [devY1, devY1, devY1]
				}, {
					name: 'Operations',
					data: [operationsY1, operationsY1, operationsY1]
				}, {
					name: 'Business',
					data: [revenueGainY1, revenueGainY2, revenueGainY3]
				}]
			});			
		
			//DRAW ROI CHART

			if($('#pricing').css('display') == "block" && document.getElementById("y1_software").value != "") {
				
				if(devTotal != 0 && operationsTotal != 0 && revenueGainTotal != 0) {
				
				$('#roi_section').css('display','block');
				
				var year1BenefitTotal = devY1 + operationsY1 + revenueGainY1;
				var year2BenefitTotal = devY2 + operationsY2 + revenueGainY2;
				var year3BenefitTotal = devY3 + operationsY3 + revenueGainY3;
				
				var year1CostTotal = parseInt(getNumbers(document.getElementById("y1_software").value)) + parseInt(getNumbers(document.getElementById("y1_services").value));
				
				if(isNaN(year1CostTotal) == true) {
					year1CostTotal = 0;
				}
				
				var year2CostTotal = parseInt(getNumbers(document.getElementById("y2_software").value)) + parseInt(getNumbers(document.getElementById("y2_services").value));
				
				if(isNaN(year2CostTotal) == true) {
					year2CostTotal = 0;
				}				
				
				var year3CostTotal = parseInt(getNumbers(document.getElementById("y3_software").value)) + parseInt(getNumbers(document.getElementById("y3_services").value));
				
				if(isNaN(year3CostTotal) == true) {
					year3CostTotal = 0;
				}				

				//DRAW ROI TABLE - costs
				
				if(document.getElementById("benefitsRow") == undefined) {
					var table = document.getElementById("roi_body");

					var row = table.insertRow(0);
					row.style.backgroundColor="#1a1a1a";
					row.style.color="white";
					row.setAttribute("id", "costRow");
					
					var title = row.insertCell(0);
					var year1 = row.insertCell(1);
					year1.setAttribute("id", "costYear1");
					var year2 = row.insertCell(2);
					year2.setAttribute("id", "costYear2");
					var year3 = row.insertCell(3);
					year3.setAttribute("id", "costYear3");

					title.innerHTML = "<img src=\"/static/dynatrace-white.svg\" style=\"width: 20px; height: 20px\"> Cost";
					year1.innerHTML = processMoney(year1CostTotal.toString());
					year2.innerHTML = processMoney(year2CostTotal.toString());
					year3.innerHTML = processMoney(year3CostTotal.toString());
				}
				
				else {
					document.getElementById("costYear1").innerHTML = processMoney(year1CostTotal.toString());
					document.getElementById("costYear2").innerHTML = processMoney(year2CostTotal.toString());
					document.getElementById("costYear3").innerHTML = processMoney(year3CostTotal.toString());					
				}
				
				//DRAW ROI TABLE - benefits
				
				if(document.getElementById("benefitsRow") == undefined) {
					var table = document.getElementById("roi_body");

					var row = table.insertRow(0);
					row.style.backgroundColor="#73be28";
					row.style.color="white";
					row.setAttribute("id", "benefitsRow");
					
					var title = row.insertCell(0);
					var year1 = row.insertCell(1);
					year1.setAttribute("id", "benefitYear1");
					var year2 = row.insertCell(2);
					year2.setAttribute("id", "benefitYear2");
					var year3 = row.insertCell(3);
					year3.setAttribute("id", "benefitYear3");

					title.innerHTML = "<img src=\"/static/sales-white.svg\" style=\"width: 20px; height: 20px\"> Benefits";
					year1.innerHTML = processMoney(year1BenefitTotal.toString());
					year2.innerHTML = processMoney(year2BenefitTotal.toString());
					year3.innerHTML = processMoney(year3BenefitTotal.toString());				
				}
				
				else {
					document.getElementById("benefitYear1").innerHTML = processMoney(year1BenefitTotal.toString());
					document.getElementById("benefitYear2").innerHTML = processMoney(year2BenefitTotal.toString());
					document.getElementById("benefitYear3").innerHTML = processMoney(year3BenefitTotal.toString());					
				}				
				
				//COST BENEFIT TOTAL
				
				var roi = ((year1BenefitTotal + year2BenefitTotal + year3BenefitTotal) / (year1CostTotal + year2CostTotal + year3CostTotal)) * 100;
				
				var payback = year1CostTotal / (year1BenefitTotal/12);
				
				document.getElementById("roi_points").innerHTML = "<ul class=\"list\"><li>ROI over the 3 years: <b>" + roi.toFixed(0) + "%</b></li><li>Year 1 payback period: <b>" + payback.toFixed(1) + " months</b></li></ul>";
				
				//DRAW CHART
				
					var column_chart = Highcharts.chart('roi_column', {
						colors: ['#73be28','#1a1a1a'],
						chart: {
							type: 'column'
						},
						title: {
							text: ''
						},
						xAxis: {
							categories: [
								'Year 1',
								'Year 2',
								'Year 3'
							],
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: ''
							}
						},
						plotOptions: {
							column: {
								pointPadding: 0.2,
								borderWidth: 0
							}
						},
						credits: {
							enabled: false
						},	
						exporting: {
							enabled: false
						},		
						tooltip: {
							enabled: false
						},
						series: [{
							name: 'Benefit',
							data: [year1BenefitTotal, year2BenefitTotal, year3BenefitTotal],
							animation: false

						}, {
							name: 'Cost',
							data: [year1CostTotal, year2CostTotal, year3CostTotal],
							animation: false

						}]
					});	
				}
			}
			
			else {
				$('#roi_section').css('display','none');
			}
	})
	

}






