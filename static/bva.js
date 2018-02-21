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
		var numb = txt.match(/\d+\.?\d+/g);
		numb = numb.join("");	
		return numb;
	}
	
	else {
		return "";
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
		document.getElementById("revenue_breach").value = processMoney(jsonResponse.revenue_breach);
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
	});	
		
	$(" .bizFromOps ").click(function() {
		$( ".ops" ).toggle( "slide" , { direction: "right" });
		$( ".biz" ).fadeIn();	
		$(".leftContainer").css("height", $('.biz').css('height'));
		$( ".result-ops" ).toggle( "slide" , { direction: "right" });
		$( ".result-biz" ).fadeIn();	
	});	
		
	$(" .devFromOps ").click(function() {
		$( ".ops" ).toggle( "slide" , { direction: "left" });
		$( ".dev" ).fadeIn();		
		$(".leftContainer").css("height", $('.dev').css('height'));
		$( ".result-ops" ).toggle( "slide" , { direction: "left" });
		$( ".result-dev" ).fadeIn();			  
	});	
		
	$(" .opsFromDev ").click(function() {
		$( ".dev" ).toggle( "slide" , { direction: "right" });
		$( ".ops" ).fadeIn();	
		$(".leftContainer").css("height", $('.ops').css('height'));
		$( ".result-dev" ).toggle( "slide" , { direction: "right" });
		$( ".result-ops" ).fadeIn();			  
	});	

	$(" .optionsFromDev ").click(function() {
		$( ".dev" ).toggle( "slide" , { direction: "left" });
		$( ".options" ).fadeIn();	
		$(".leftContainer").css("height", $('.options').css('height'));
		$( ".result-dev" ).toggle( "slide" , { direction: "left" });
		$( ".result-options" ).fadeIn();			  
	});	

	$(" .devFromOptions ").click(function() {
		$( ".options" ).toggle( "slide" , { direction: "right" });
		$( ".dev" ).fadeIn();		
		$(".leftContainer").css("height", $('.dev').css('height'));
		$( ".result-options" ).toggle( "slide" , { direction: "right" });
		$( ".result-dev" ).fadeIn();			  
	});	
		
	$('#company_revenue, #revenue_breach, #operation_cost, #developer_cost, #qa_cost, #annual_cost, #y1_software, #y1_services, #y2_software, #y2_services, #y3_software, #y3_services').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = document.getElementById("currency").value + parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
	} );
		
	$('#projected_growth, #revenue_dependent, #app_uptime, #test_per_cycle, #qa_time_per_cycle, #dev_time_per_cycle, #benefit_incident_reduction, #benefit_mttr, #benefit_performance, #benefit_alert_storm, #benefit_sla, #benefit_fix_qa, #benefit_prod_reduction, #benefit_config, #existing_y1, #existing_y2, #existing_y3').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
	} );
		
	$('#incidents_month, #no_ops_troubleshoot, #no_dev_troubleshoot, #mttr, #no_apps_e2e, #no_t1t2_apps, #no_fte_existing, #cycles_per_year, #cycle_days, #qa_people_per_cycle, #dev_people_per_cycle, #work_hours, #no_fte_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
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