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

function failedLogin() {
	var urlParams = new URLSearchParams(window.location.search);
	fail = urlParams.get('login');
	if(fail == "failed") {
		$(".login-failure").css("display", "block");
	}
}

function makeFetch(reqUrl, reqBody, reqMethod, cb) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	if(reqMethod == "POST") {
		var myInit = { method: reqMethod,
			headers: myHeaders,
			cache: 'default',
			body: JSON.stringify(reqBody)
		}
	}
	
	if(reqMethod == "GET") {
		var myInit = { method: reqMethod,
			headers: myHeaders,
			cache: 'default',
		}		
	}
	
	fetch(reqUrl, myInit)
		
	.then(function(response) {	
			return response.json;
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
		
		for(i=0;i<jsonObj.length;i++) {
			newHTML += '<option value="' + jsonObj[i]._id + '">' + jsonObj[i].company + '</option>';
		}
		
		document.getElementById("bva_select").innerHTML = newHTML;
	})
}

function updateAssessment() {
	var assessment_data = {
		company_revenue: getNumbers(document.getElementById("company_revenue").value),
		projected_growth: getNumbers(document.getElementById("projected_growth").value),
		revenue_dependent: getNumbers(document.getElementById("revenue_dependent").value),
		app_uptime: getNumbers(document.getElementById("app_uptime").value),
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
		test_per_cycle: getNumbers(document.getElementById("test_per_cycle").value),
		qa_time_per_cycle: getNumbers(document.getElementById("qa_time_per_cycle").value),
		qa_people_per_cycle: getNumbers(document.getElementById("qa_people_per_cycle").value),
		dev_time_per_cycle: getNumbers(document.getElementById("dev_time_per_cycle").value),
		dev_people_per_cycle: getNumbers(document.getElementById("dev_people_per_cycle").value),
		operation_cost: getNumbers(document.getElementById("operation_cost").value),
		developer_cost: getNumbers(document.getElementById("developer_cost").value),
		qa_cost: getNumbers(document.getElementById("qa_cost").value),
		work_hours: getNumbers(document.getElementById("work_hours").value),
		benefit_incident_reduction: getNumbers(document.getElementById("benefit_incident_reduction").value),
		benefit_mttr: getNumbers(document.getElementById("benefit_mttr").value),
		benefit_performance: getNumbers(document.getElementById("benefit_performance").value),
		benefit_alert_storm: getNumbers(document.getElementById("benefit_alert_storm").value),
		benefit_sla: getNumbers(document.getElementById("benefit_sla").value),
		benefit_fix_qa: getNumbers(document.getElementById("benefit_fix_qa").value),
		benefit_prod_reduction: getNumbers(document.getElementById("benefit_prod_reduction").value),
		benefit_config: getNumbers(document.getElementById("benefit_config").value)
	}
	
	console.log(assessment_data);
}