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

function processMoney(preMoney) {
	if(preMoney != '' && preMoney != undefined) {preMoney = '£' + parseInt(getNumbers(preMoney)).toLocaleString(); temp = preMoney; preMoney = ''; preMoney = temp; return preMoney} else {preMoney = ''; return preMoney}
}

function processPercent(prePercent) {
	if(prePercent != '' && prePercent != undefined) {prePercent = getNumbersAndDots(prePercent) + '%'; temp = prePercent; prePercent = ''; prePercent = temp; return prePercent;} else {prePercent = ''; return prePercent;}
}

function processNumber(preNumber){
	if(preNumber != '' && preNumber != undefined) {preNumber = parseInt(getNumbers(preNumber)).toLocaleString(); temp = preNumber; preNumber = ''; preNumber = temp; return preNumber; } else {preNumber = ''; return preNumber;}
}

function failedLogin() {
	var urlParams = new URLSearchParams(window.location.search);
	fail = urlParams.get('login');
	if(fail == "failed") {
		$(".login-failure").css("display", "block");
	}
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
		
		for(i=0;i<jsonObj.length;i++) {
			newHTML += '<option value="' + jsonObj[i]._id + '">' + jsonObj[i].company + '</option>';
		}
		
		document.getElementById("bva_select").innerHTML = newHTML;
	})
}

function getAssessmentData() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	var urlParams = new URLSearchParams(window.location.search);
	bva_id = urlParams.get('bva_id');
	
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
		benefit_config: getNumbersAndDots(document.getElementById("benefit_config").value)
	}
	
	console.log(assessment_data);
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	
	var urlParams = new URLSearchParams(window.location.search);
	bva_id = urlParams.get('bva_id');
	
	myHeaders.append("bva_id", bva_id);
	
	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(assessment_data)
	}		
	
	fetch('/updateAssessment', myInit)
		
	.then(function(response) {
		console.log("test update");
	})
}

document.addEventListener("DOMContentLoaded", function(event) {
	
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
		
	$('#company_revenue, #revenue_breach, #operation_cost, #developer_cost, #qa_cost').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = '£' + parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
	} );
		
	$('#projected_growth, #revenue_dependent, #app_uptime, #test_per_cycle, #qa_time_per_cycle, #dev_time_per_cycle, #benefit_incident_reduction, #benefit_mttr, #benefit_performance, #benefit_alert_storm, #benefit_sla, #benefit_fix_qa, #benefit_prod_reduction, #benefit_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
	} );
		
	$('#incidents_month, #no_ops_troubleshoot, #no_dev_troubleshoot, #mttr, #no_apps_e2e, #no_t1t2_apps, #no_fte_existing, #cycles_per_year, #cycle_days, #qa_people_per_cycle, #dev_people_per_cycle, #work_hours').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
	});

	getAssessmentData();	
});	