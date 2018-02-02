










function activateControls() {
	document.getElementById("fullroi_intro").setAttribute("onclick","switchSubNav(this.id)");
	document.getElementById("fullroi_input").setAttribute("onclick","switchSubNav(this.id)");
	document.getElementById("fullroi_report").setAttribute("onclick","switchSubNav(this.id); buildResults();");
}

function getNumbers(txt) {
	var numb = txt.match(/\d/g);
	if(numb != null) {
		numb = numb.join("");	
	}
	
	else {
		numb = "null";
	}
	
	return numb;
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function switchSubNav(divId) {

	//introductionSave();
	buildBenefitsTable();
	retrieveGeneralDetails();
	retrieveApplications();
	buildCostTable();
	buildDetailsTable();

	

	if(document.getElementById("dynatrace_cost").checked == false) {
		document.getElementById("fullroi_input_prod").style.display = "none";
	}
	else {
		document.getElementById("fullroi_input_prod").style.display = "block";
	}	
	
	menu = document.getElementById("fullroi");
	i = 0;

	while(menu.children[i] != undefined) {

		if(menu.children[i].id == divId) {
			$( '#' + menu.children[i].id ).addClass("is-current");
			$("#c_" + menu.children[i].id).fadeIn();

			if(menu.children[i].id == "fullroi_input") {
				$( '#fullroi_input_prod_cont' ).fadeIn;
			}
		}

		else {
			$( '#' + menu.children[i].id ).removeClass("is-current");
			$("#c_" + menu.children[i].id).css("display", "none");
		}

		i++;
	}

}

function switchTab (divId) {
	menu = document.getElementById("c_fullroi_input");
	i = 1;
	
	while(menu.children[i] != undefined) {

		if(menu.children[i].id == divId + "_cont") {
			$( '#' + menu.children[i].id ).addClass("is-active");
			$( '#' + menu.children[i].id).fadeIn();
		}

		else {
			$( '#' + menu.children[i].id ).removeClass("is-active");
			$( '#' + menu.children[i].id).css("display", "none");
		}

		i++;
	}
}

function switchSideBar (divId) {
	menu = document.getElementById("fullroi_input_bus_cont_menu");
	i = 0;

	while(menu.children[i] != undefined) {

		if(menu.children[i].id == divId) {
			$( '#' + menu.children[i].id).addClass("is-current");
			$( '#' + menu.children[i].id + "_cont" ).fadeIn();
		}

		else {
			$( '#' + menu.children[i].id).removeClass("is-current");
			$( '#' + menu.children[i].id + "_cont" ).css("display", "none");
		}

		i++;
	}
}

//Draw blank highchart

function drawBlank() {
$(function () {
				
				blankData = [];
				
				var now = new Date;
				var rightNow = now.getTime();
				var first = rightNow - 3600000;
				
				blankData.push([first, 100]);
				
				for(i=1; i < 12; i++) {
					blankData.push([(first + 300000 * i), 100]);
				}	
			
				var myChart = Highcharts.chart('container', {
						title: {
							style: {
								color: "#ffffff"
							},
							text: ''
						},
					
					exporting: {
						enabled: false
					},
					
					plotOptions: {
						line: {
							marker: {
								enabled: false
							},
						},
					},
					
					chart: {
						backgroundColor: "#ffffff",
						borderColor: "#ffffff",
						borderRadius: 3,
						borderWidth: 2,
						spacingBottom: 5,
						spacingTop: 5,
						spacingLeft: 1,
						spacingRight: 5,	

						update: {
							redraw: false
						},						
					},	
					
					credits: {
						enabled: false
					},
					
					yAxis: {
							title: {
								text: 'Response Time (ms)',
								style: {
									color: "#000000"
								}
							},
							
							min: 0,
							max: 50,
							
							labels: {
								style: {
									color: "#000000"
								}
							}
					},
					
					xAxis: {
							type: 'datetime',

							labels: {
								style: {
									color: "#000000"
								}
							},
							
							title: {
								style: {
									color: "#000000"
								},
							enabled: false
						}
					},
					
					legend: {
						enabled: false
				},

					series: [{
						type: 'line',
						forced: 'true',
						name: 'Time (ms)',
						data: blankData
					}]
				});
			});

}

function addApplication() {
	var application_name = document.getElementById("application_name").value;
	var application_users = document.getElementById("application_users").value;
	var userId = getUserId();
	var application_id = generateId();	
	
	var table = document.getElementById("application_list");
    var length = document.getElementById("application_list").rows.length;
	var row = table.insertRow(length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
    cell1.innerHTML = '<input id="' + application_id + '" disabled type="text" class="inputfield"  style="width: 100%;" />';
    cell2.innerHTML = '<input disabled type="text" class="inputfield" style="width: 100%;" />';
	cell3.innerHTML = '<button style="width:32px;height:32px;padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;" role="button" type="button" class="btn btn--secondary" role="button" type="button" ><img src="/static/edit-blue.svg" height="56px" width="56px"></button>';
	cell3.align = 'center';
	cell4.innerHTML = '<button style="width:32px;height:32px;padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;" role="button" type="button" class="btn btn--secondary" role="button" type="button" ><img src="/static/delete-blue.svg" height="56px" width="56px"></button>';
	cell4.align = 'center';
	
	//Add application name and description
	document.getElementById("application_list").children[0].children[length].getElementsByTagName("input")[0].value=application_name;
	document.getElementById("application_list").children[0].children[length].getElementsByTagName("input")[1].value=application_users;	
	
	//Enable edit button
	document.getElementById("application_list").children[0].children[length].getElementsByTagName("button")[0].addEventListener("click", function(){
        this.parentElement.parentElement.getElementsByTagName("input")[0].removeAttribute("disabled");
		this.parentElement.parentElement.getElementsByTagName("input")[1].removeAttribute("disabled");
	});

	//Enable delete button
	document.getElementById("application_list").children[0].children[length].getElementsByTagName("button")[1].addEventListener("click", function(){
        applicationId =  this.parentElement.parentElement.children[0].children[0].id;
		deleteApplication(applicationId);
		index = this.parentElement.parentElement.rowIndex;
		document.getElementById("application_list").deleteRow(index);
	});
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	var myInit = { method: 'POST',
        headers: myHeaders,
        cache: 'default',
		body: JSON.stringify({"userId":userId,"application_id":application_id,"application_name":application_name, "application_users": application_users})
	};

	fetch('/addApplication', myInit)
		
	.then(function(response) {	
			document.getElementById("application_name").value="";
			document.getElementById("application_users").value="";
			addApplicationsToDetails();
			return response;
	})	
}

function deleteApplication(applicationId) {
	
	var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Accept", "application/json");
		
		var myInit = { method: 'POST',
			headers: myHeaders,
			cache: 'default',
			body: JSON.stringify({"application_id":applicationId})
		};

		fetch('/deleteApplication', myInit)
			
		.then(function(response) {	
				return response;
		})		
}

function retrieveApplications() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getApplications', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {
		for(i=application_list.rows.length -1; i >= 0 ; i--) {
			application_list.deleteRow(i);
		}
		
		for(i=0; i < jsonResponse.application.length; i++) {
			var application_name = jsonResponse.application[i].application_name;
			var application_users = jsonResponse.application[i].application_users;
			var userId = getUserId();
			var application_id = jsonResponse.application[i].id;	
			
			var table = document.getElementById("application_list");
			var row = table.insertRow();
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			cell1.innerHTML = '<input id="' + application_id + '" disabled type="text" class="inputfield" style="width: 100%;" />';
			cell2.innerHTML = '<input disabled type="text" class="inputfield" style="width: 100%;" />';
			cell3.innerHTML = '<button style="width:32px;height:32px;padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;" role="button" type="button" class="btn btn--secondary"><img src="/static/edit-blue.svg" height="56px" width="56px"></button>';
			cell3.align = 'center';
			cell4.innerHTML = '<button style="width:32px;height:32px;padding-left:0px;padding-right:0px;padding-top:0px;padding-bottom:0px;" role="button" type="button" class="btn btn--secondary"><img src="/static/delete-blue.svg" height="56px" width="56px"></button>';
			cell4.align = 'center';
			
			//Add application name and description
			document.getElementById("application_list").children[0].children[i].getElementsByTagName("input")[0].value=application_name;
			document.getElementById("application_list").children[0].children[i].getElementsByTagName("input")[1].value=application_users;	
			
			//Enable edit button
			document.getElementById("application_list").children[0].children[i].getElementsByTagName("button")[0].addEventListener("click", function(){
				this.parentElement.parentElement.getElementsByTagName("input")[0].removeAttribute("disabled");
				this.parentElement.parentElement.getElementsByTagName("input")[1].removeAttribute("disabled");
			});

			//Enable delete button
			document.getElementById("application_list").children[0].children[i].getElementsByTagName("button")[1].addEventListener("click", function(){
				applicationId =  this.parentElement.parentElement.children[0].children[0].id;
				deleteApplication(applicationId);
				index = this.parentElement.parentElement.rowIndex;
				document.getElementById("application_list").deleteRow(index);
			});		

		}
		
		
		
		
		
		
		
	})
		
}

function getUserId() {
	var reg = /(application=)(.{10})/;
	match = document.cookie.match(new RegExp(reg));
	if (match) {
		var userId = match[2];
		return userId;
	}
	else {
		console.log("no ID found");
	}
}

function retrieveOptions() {
	userId = document.getElementById("userId").value;
	// document.getElementById("displayBvaId").innerHTML=userId;
	document.cookie='application=' + userId;	
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getOptions', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		document.getElementById("it_downtime").checked = jsonResponse.it_downtime;
		document.getElementById("employee_productivity").checked = jsonResponse.employee_productivity;
		document.getElementById("incident_frequency").checked = jsonResponse.incident_frequency;
		document.getElementById("service_desk").checked = jsonResponse.service_desk;
		document.getElementById("sla_compliance").checked = jsonResponse.sla_compliance;
		// document.getElementById("cloud_bill").checked = jsonResponse.cloud_bill;
		// document.getElementById("speed_market").checked = jsonResponse.speed_market;
		
		document.getElementById("company_name").value = jsonResponse.company_name;
		document.getElementById("study_period").value = jsonResponse.study_period;
		// document.getElementById("dynatrace_cost").checked = jsonResponse.dynatrace_cost;
		// document.getElementById("competitive_analysis").checked = jsonResponse.competitive_analysis;
				
		buildBenefitsTable();
		//retrieveGeneralDetails();
	})
	
}

function buildBenefitsTable() {

	for(i=expected_benefits.rows.length -1; i >= 0 ; i--) {
		expected_benefits.deleteRow(i);
	}

	userId = document.getElementById("userId").value;
	document.getElementById("displayBvaId").innerHTML=userId;
	//document.cookie='application=' + userId;	
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getOptions', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
	
	htmlString = "<h3>General details</h3><br />";
	
	if(jsonResponse.it_downtime == true){
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Decrease in revenue affecting incidents";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="dec_rev_incidents" style="width: 75px;" placeholder="50"/>'; 
		
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduction in downtime";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_downtime" style="width: 75px;" placeholder="40"/>'; 
		
		
	}
	
	if(jsonResponse.employee_productivity == true) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Increased employee productivity";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="increase_employee_prod" style="width: 75px;" placeholder="15"/>';

		htmlString += '<label for="bus_days" class="label">How many business days does the typical IT resource work per year?</label><input style="width: 150px;" type="number" class="inputfield" placeholder="220" id="bus_days"/><br /><br />';
	}
	
	if(jsonResponse.incident_frequency == true) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Decrease in incidents that affect all end users";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="decrease_user_incidents" style="width: 75px;" placeholder="50"/>'; 
		
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduce the resources taken to resolve incidents";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_incident_resolve" style="width: 75px;" placeholder="50"/>'; 	
		
		
	}
	
	if(jsonResponse.service_desk == true) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduce the volume of service desk calls";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_service_desk" style="width: 75px;" placeholder="50"/>'; 

		htmlString += '<label for="svc_desk_cost" class="label">What is the cost of a service desk call? (£)</label><input style="width: 150px;" type="number" class="inputfield" placeholder="10" id="svc_desk_cost"/><br /><br />';	
	}
	
	if(jsonResponse.sla_compliance == true) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduce SLA penalties";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_sla_penalties" style="width: 75px;" placeholder="25"/>'; 	
		
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduce resources needed to produce SLA reports";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_sla_resources" style="width: 75px;" placeholder="25"/>'; 
	}
	
	if(jsonResponse.cloud_bill == true) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Reduce your cloud bill";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="reduce_cloud_bill" style="width: 75px;" placeholder="50"/>'; 		
	}
		
	if(jsonResponse.speed_market) {
		var table = document.getElementById("expected_benefits");
		var row = table.insertRow();
		var it_downtime_desc = row.insertCell(0); 
		it_downtime_desc.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		it_downtime_desc.innerHTML="Increase your time to market";
		
		var it_downtime_input = row.insertCell(1); 
		it_downtime_input.setAttribute("align","middle"); 
		it_downtime_input.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
		it_downtime_input.innerHTML = '<input type="number" class="inputfield" id="increase_time_market" style="width: 75px;" placeholder="30"/>'; 			
	}
	
	if(jsonResponse.incident_frequency == true && jsonResponse.sla_compliance == true) {
		htmlString += '<label for="avg_salary" class="label">What is the average salary of an IT staff member? (£)</label><input style="width: 150px;" type="number" class="inputfield" placeholder="65000" id="avg_salary"/><br /><br />';
	}

	htmlString += '<label for="rev_growth" class="label">Expected revenue growth (%)</label><input style="width: 150px;"  type="text" class="inputfield" placeholder="3" id="rev_growth"/><br /><br />';
    htmlString += '<label for="npv" class="label">Net Present Value (%)</label><input style="width: 150px;"  type="text" class="inputfield" placeholder="12" id="npv"/><br /><br />';
	htmlString += '<label for="confidence" class="label">How confident are you in the numbers provided?</label><select style="width: 150px;"  class="select" id="confidence"><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option><option value="60">60%</option><option value="70" selected = "selected">70%</option><option value="80">80%</option><option value="90">90%</option><option value="100">100%</option></select><br /><br />';
	
	document.getElementById("fullroi_input_org_cont").children[0].children[1].children[0].innerHTML=htmlString;
	
	//console.log(htmlString);
	
	retrieveExpectedBenefits();
	retrieveGeneralDetails();
	})
	
	
}

function introductionSave() {
	var userId = getUserId();
	var it_downtime = document.getElementById("it_downtime").checked;
	var employee_productivity = document.getElementById("employee_productivity").checked;
	var incident_frequency = document.getElementById("incident_frequency").checked;
	var service_desk = document.getElementById("service_desk").checked;
	var sla_compliance = document.getElementById("sla_compliance").checked;

	var cloud_bill = document.getElementById("cloud_bill").checked;
	var speed_market = document.getElementById("speed_market").checked;
	
	var company_name = document.getElementById("company_name").value;
	var study_period = document.getElementById("study_period").value;
	var dynatrace_cost = document.getElementById("dynatrace_cost").checked;
	var competitive_analysis = document.getElementById("competitive_analysis").checked;
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	var myInit = { method: 'POST',
        headers: myHeaders,
        cache: 'default',
		body: JSON.stringify({"userId":userId, "it_downtime": it_downtime, "employee_productivity": employee_productivity, "incident_frequency":incident_frequency, "service_desk": service_desk, "sla_compliance": sla_compliance, "cloud_bill": cloud_bill, "speed_market": speed_market, "company_name": company_name, "study_period": study_period, "dynatrace_cost": dynatrace_cost, "competitive_analysis": competitive_analysis})
	};
	
	fetch('/insertOptions', myInit)
		
	.then(function(response) {	
			return response;
	})
}

function expectedBenefitsSave() {
	var userId = getUserId();

	var jsonStr = '{"userId":"' + userId + '"';
	
	if (document.getElementById("dec_rev_incidents") == null) {  }
	else { jsonStr += ',"dec_rev_incidents":' + document.getElementById("dec_rev_incidents").value; }

	if (document.getElementById("reduce_downtime") == null) { }
	else { jsonStr += ',"reduce_downtime":' + document.getElementById("reduce_downtime").value; }

	if (document.getElementById("increase_employee_prod") == null) {  }
	else { jsonStr += ',"increase_employee_prod":' + document.getElementById("increase_employee_prod").value; }

	if (document.getElementById("decrease_user_incidents") == null) { }
	else { jsonStr += ',"decrease_user_incidents":' + document.getElementById("decrease_user_incidents").value; }

	if (document.getElementById("reduce_incident_resolve") == null) { }
	else { jsonStr += ',"reduce_incident_resolve":' + document.getElementById("reduce_incident_resolve").value; }
	
	if (document.getElementById("reduce_service_desk") == null) {  }
	else { jsonStr += ',"reduce_service_desk":' + document.getElementById("reduce_service_desk").value; }
	
	if (document.getElementById("reduce_sla_penalties") == null) { }
	else { jsonStr += ',"reduce_sla_penalties":' + document.getElementById("reduce_sla_penalties").value; }

	if (document.getElementById("reduce_sla_resources") == null) {  }
	else { jsonStr += ',"reduce_sla_resources":' + document.getElementById("reduce_sla_resources").value; }
	
	if (document.getElementById("reduce_cloud_bill") == null) { }
	else { jsonStr += ',"reduce_cloud_bill":' + document.getElementById("reduce_cloud_bill").value; }	

	if (document.getElementById("increase_time_market") == null) {  }
	else { jsonStr += ',"increase_time_market":' + document.getElementById("increase_time_market").value; }
	
	jsonStr += '}';
		
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	var myInit = { method: 'POST',
        headers: myHeaders,
        cache: 'default',
		body: jsonStr
	};

	fetch('/insertExpectedBenefits', myInit)
		
	.then(function(response) {	
			return response;
	})
}

function generalDetailsSave() {
	var userId = getUserId();

	var jsonStr = '{"userId":"' + userId + '"';

	if (document.getElementById("bus_days") == null) {  }
	else { jsonStr += ',"bus_days":' + document.getElementById("bus_days").value; }

	if (document.getElementById("npv") == null) {  }
	else { jsonStr += ',"npv":' + document.getElementById("npv").value; }

	if (document.getElementById("avg_salary") == null) {  }
	else { jsonStr += ',"avg_salary":' + document.getElementById("avg_salary").value; }

	if (document.getElementById("svc_desk_cost") == null) {  }
	else { jsonStr += ',"svc_desk_cost":' + document.getElementById("svc_desk_cost").value; }

	if (document.getElementById("rev_growth") == null) {  }
	else { jsonStr += ',"rev_growth":' + document.getElementById("rev_growth").value; }
	
	if (document.getElementById("confidence") == null) {  }
	else { jsonStr += ',"confidence":' + document.getElementById("confidence").value; }
	
	jsonStr += '}';
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	var myInit = { method: 'POST',
        headers: myHeaders,
        cache: 'default',
		body: jsonStr
	};

	fetch('/insertGeneralDetails', myInit)
		
	.then(function(response) {	
			return response;
	})
}

function retrieveExpectedBenefits() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getExpectedBenefits', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		var dec_rev_incidents = document.getElementById("dec_rev_incidents"); if(dec_rev_incidents != null) { dec_rev_incidents.value = jsonResponse.dec_rev_incidents}
		var reduce_downtime = document.getElementById("reduce_downtime"); if(reduce_downtime != null) { reduce_downtime.value = jsonResponse.reduce_downtime}
		var increase_employee_prod = document.getElementById("increase_employee_prod"); if(increase_employee_prod != null) { increase_employee_prod.value = jsonResponse.increase_employee_prod}
		var decrease_user_incidents = document.getElementById("decrease_user_incidents"); if(decrease_user_incidents != null) { decrease_user_incidents.value = jsonResponse.decrease_user_incidents}
		var reduce_incident_resolve = document.getElementById("reduce_incident_resolve"); if(reduce_incident_resolve != null) { reduce_incident_resolve.value = jsonResponse.reduce_incident_resolve}
		var reduce_service_desk = document.getElementById("reduce_service_desk"); if(reduce_service_desk != null) { reduce_service_desk.value = jsonResponse.reduce_service_desk}		
		var reduce_sla_penalties = document.getElementById("reduce_sla_penalties"); if(reduce_sla_penalties != null) { reduce_sla_penalties.value = jsonResponse.reduce_sla_penalties}
		var reduce_sla_resources = document.getElementById("reduce_sla_resources"); if(reduce_sla_resources != null) { reduce_sla_resources.value = jsonResponse.reduce_sla_resources}
		var reduce_cloud_bill = document.getElementById("reduce_cloud_bill"); if(reduce_cloud_bill != null) { reduce_cloud_bill.value = jsonResponse.reduce_cloud_bill}
		var increase_time_market = document.getElementById("increase_time_market"); if(increase_time_market != null) { increase_time_market.value = jsonResponse.increase_time_market}
	})
	
}

function retrieveGeneralDetails() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getGeneralDetails', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		var bus_days = document.getElementById("bus_days"); if(bus_days != null) { bus_days.value = jsonResponse.bus_days}
		var npv = document.getElementById("npv"); if(npv != null) { npv.value = jsonResponse.npv}
		var avg_salary = document.getElementById("avg_salary"); if(avg_salary != null) { avg_salary.value = jsonResponse.avg_salary}
		var svc_desk_cost = document.getElementById("svc_desk_cost"); if(svc_desk_cost != null) { svc_desk_cost.value = jsonResponse.svc_desk_cost}
		var rev_growth = document.getElementById("rev_growth"); if(rev_growth != null) { rev_growth.value = jsonResponse.rev_growth}
		var confidence = document.getElementById("confidence"); if(confidence != null) { confidence.value = jsonResponse.confidence}		
	})
	
}

function generateId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 10; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function buildCostTable() {
	for(i=product_cost.children[1].rows.length; i > 0 ; i--) {
		product_cost.deleteRow(i);
	}

	userId = getUserId();	
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getOptions', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		noYears = jsonResponse.study_period;
		year = (new Date()).getFullYear();
		
		var table = document.getElementById("product_cost");
		
		for(i=0;i<noYears;i++) {
			
			var row = table.children[1].insertRow();
			var product_year = row.insertCell(0); 
			product_year.setAttribute("id",i+1);			
			product_year.innerHTML=year + i;	

			var license_fees = row.insertCell(1); 
			license_fees.innerHTML = '<input type="number" class="inputfield" id="license_fees_y' + (i+1) +'"/>';			

			var maintenance = row.insertCell(2); 
			maintenance.innerHTML = '<input type="number" class="inputfield" id="maintenance_y' + (i+1) +'"/>';			
			
			var hardware = row.insertCell(3); 
			hardware.innerHTML = '<input type="number" class="inputfield" id="hardware_y' + (i+1) +'"/>';		

			var implementation = row.insertCell(4); 
			implementation.innerHTML = '<input type="number" class="inputfield" id="implementation_y' + (i+1) +'"/>';	

			var training = row.insertCell(5); 
			training.innerHTML = '<input type="number" class="inputfield" id="training_y' + (i+1) +'"/>';				
		}
		
	retrieveCostValues();		
	})
}

function saveCostTable() {
	var table = document.getElementById("product_cost");
	var userId = getUserId();
	noYears = parseInt(document.getElementById("study_period").value);
	noYears = noYears + 1;
	
	var jsonStr = '{"_id":"' + userId + '","costs":[]}';
	var obj = JSON.parse(jsonStr);	
	
	for(i=1;i<noYears;i++) {
		license_fees = document.getElementById("license_fees_y" + i).value;
		maintenance = document.getElementById("maintenance_y" + i).value;
		hardware = document.getElementById("hardware_y" + i).value;
		implementation = document.getElementById("implementation_y" + i).value;
		training = document.getElementById("training_y" + i).value;
		
		obj.costs.push({"license_fees":license_fees,"maintenance":maintenance,"hardware":hardware,"implementation":implementation,"training":training});
	}

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	
	var myInit = { method: 'POST',
        headers: myHeaders,
        cache: 'default',
		body: JSON.stringify(obj)
	};

	fetch('/insertProductCosts', myInit)
		
	.then(function(response) {	
			return response;
	})	
	
	
	
}

function retrieveCostValues() {
	var table = document.getElementById("product_cost");
	var userId = getUserId();
	noYears = parseInt(document.getElementById("study_period").value);
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	myHeaders.append("noYears", noYears);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};

	fetch('/getProductCosts', myInit)
		
	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonObj) {
	
		if(jsonObj[0] != undefined) {
			for(i=0;i<noYears;i++) {
				document.getElementById("license_fees_y" + (i+1)).value = jsonObj[0].costs[i].license_fees;
				document.getElementById("maintenance_y" + (i+1)).value = jsonObj[0].costs[i].maintenance;
				document.getElementById("hardware_y" + (i+1)).value = jsonObj[0].costs[i].hardware;
				document.getElementById("implementation_y" + (i+1)).value = jsonObj[0].costs[i].implementation;
				document.getElementById("training_y" + (i+1)).value = jsonObj[0].costs[i].training;
			}
		}

		else {
			
		}
	})
}

function addApplicationsToDetails() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getApplications', myInit)

	.then(function(response) {	
		return response.json();
	})	
	
	.then(function(jsonResponse) {
		
		if(jsonResponse.application.length == 0) {
			var length = document.getElementById("details").children.length;
			
			for(i=1; i<length; i++) {
				var newLength = document.getElementById("details").children[i].children[1].children[0].children.length;
				
				for(x=0;x<newLength; x++) {
					document.getElementById("details").children[i].children[1].children[0].removeChild(document.getElementById("details").children[i].children[1].children[0].childNodes[x]);
				}
			}
		}		
		
		else {
			var details = document.getElementById("details");

			r = 0;
			
			for(i=0;i<details.children.length;i++) {
				if(details.children[i].style.display == "table-row-group") {
					r++;
				}
			}			
			
			for(i=1;i<r;i++) {
				
				details.children[i].children[1].children[0].innerHTML="";
				
				var length = jsonResponse.application.length;
						
				var containers = Math.ceil(length / 5);		
				
				
				if(details.children[i].style.display=="table-row-group") {
					for(x=0;x<containers;x++) {
						var details = document.getElementById("details");
						var newDiv = document.createElement("div");
						newDiv.classList.add("container");
						newDiv.style.display="flex";
						details.children[i].children[1].children[0].appendChild(newDiv);
						
								
						for(y=1 + x * 5; y < (x+1) * 5 + 1;y++ ) {
							var details = document.getElementById("details");
							divApp = document.createElement("div");
							divApp.classList.add("column--1-of-5");
							divApp.setAttribute("style","width: 20%; margin-bottom: 30px");
							details.children[i].children[1].children[0].children[x].appendChild(divApp);
						}
					}					
				}
				
				column = 0;
				columnint = 0;
				containerint = 0;
				
				for(a=1;a<length + 1;a++) {
					container = Math.ceil(a / 5);
					container = container - 1;
					
					if(details.children[i].children[1].children[0].children[container].children[column].parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerHTML == "<h4>Lost revenue from IT downtime</h4>") {
						details.children[i].children[1].children[0].children[container].children[column].innerHTML='<h4>' + jsonResponse.application[a-1].application_name + '</h4><br /><label for="' + jsonResponse.application[a-1].id + '_revincidents" class="label">Revenue impacting incidents per month</label><input type="text" class="inputfield" id="' + jsonResponse.application[a-1].id +'_revincidents" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id +'_revperminute" class="label">Revenue lost per minute (£)</label><input type="text" class="inputfield" id="' + jsonResponse.application[a-1].id +'_revperminute" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id +'_mttr" class="label">MTTR (mins)</label><input type="text" class="inputfield" id="' + jsonResponse.application[a-1].id +'_mttr" style="width:75%"/><br /><br />';
						
						
					}
					
					if(details.children[i].children[1].children[0].children[container].children[columnint].parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerHTML == "<h4>Increase employee productivity</h4>" && jsonResponse.application[a-1].application_users == "internal") {
											
						details.children[i].children[1].children[0].children[container].children[columnint].innerHTML='<h4>' + jsonResponse.application[a-1].application_name + '</h4><br /><label for="' + jsonResponse.application[a-1].id + '_numusers" class="label">Average number of users</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_numusers" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_bustransperday" class="label">Number of transactions per user per day</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_bustransperday" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_busincidents" class="label">Percentage of users affected by an incident</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_busincidents" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_bustransavgtime" class="label">Average time for a transaction (s)</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_bustransavgtime" style="width:75%"/><br /><br />';
						
						columnint = columnint + 1;
						if(columnint == 5) { columnint = 0; containerint ++;}
					}

					if(details.children[i].children[1].children[0].children[container].children[column].parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerHTML == "<h4>Reduce the frequency and cost of incidents</h4>") {
						details.children[i].children[1].children[0].children[container].children[column].innerHTML='<h4>' + jsonResponse.application[a-1].application_name + '</h4><br /><label for="' + jsonResponse.application[a-1].id + '_allincidents" class="label">Total number of incidents/month</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_allincidents" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_itstaffhours" class="label">Number of staff hours spent per incident</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_itstaffhours" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_itstaffnum" class="label">Total number of staff per incident</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_itstaffnum" style="width:75%"/><br /><br />';
					}	

					if(details.children[i].children[1].children[0].children[container].children[column].parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerHTML == "<h4>Service desk cost</h4>") {
						details.children[i].children[1].children[0].children[container].children[column].innerHTML='<h4>' + jsonResponse.application[a-1].application_name + '</h4><br /><label for="' + jsonResponse.application[a-1].id + '_svcdeskpermonth" class="label">Number of service desk calls per month</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_svcdeskpermonth" style="width:75%"/><br /><br />';
					}	

					if(details.children[i].children[1].children[0].children[container].children[column].parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerHTML == "<h4>SLA compliance and reporting</h4>") {
						details.children[i].children[1].children[0].children[container].children[column].innerHTML='<h4>' + jsonResponse.application[a-1].application_name + '</h4><br /><label for="' + jsonResponse.application[a-1].id + '_currentslapenalties" class="label">Current SLA penalties per month (£)</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_currentslapenalties" style="width:75%"/><br /><br /><label for="' + jsonResponse.application[a-1].id + '_currenttimeslareport" class="label">Time creating SLA reports per month</label><input type="number" class="inputfield" id="' + jsonResponse.application[a-1].id +'_currenttimeslareport" style="width:75%"/><br /><br />';
					}					
					
						
					
					
					
					
					
					
					
					
					column = column + 1;
					if(column == 5) { column = 0;}
					
				}			
			}
		}
	})
}

function buildDetailsTable() {
	var details = document.getElementById("details");
	
	for(i=details.children.length-1; i > 0 ; i--) {
		details.children[i].style.display="none";
	}

	userId = getUserId();	
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getOptions', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {

	
	

	var details = document.getElementById("details");
	
	details.children[0].style.display="table-row-group";

	
		if(jsonResponse.it_downtime == true){
			details.children[1].style.display="table-row-group";
		}
		if(jsonResponse.employee_productivity == true){
			details.children[2].style.display="table-row-group";
		}
		if(jsonResponse.incident_frequency == true){
			details.children[3].style.display="table-row-group";
		}
		if(jsonResponse.service_desk == true){
			details.children[4].style.display="table-row-group";
		}
		if(jsonResponse.sla_compliance == true){
			details.children[5].style.display="table-row-group";
		}
		if(jsonResponse.cloud_bill == true){
		
		}
		if(jsonResponse.speed_market == true){
		
		}

		var details = document.getElementById("details");
		var colour = 1;
		for(i=1;i<details.children.length;i++) {

			if(details.children[i].style.display=="" && colour ==1) {
				details.children[i].children[0].setAttribute("style","background-color: #F8F8F8");
				colour = 0;
				continue;
			}
			if(details.children[i].style.display=="" && colour == 0) {
				details.children[i].children[0].setAttribute("style","background-color: white");
				colour = 1;
			} 
		}


	addApplicationsToDetails();
	retrieveApplicationDetails();
		
	})
}

function saveApplicationDetails() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getApplications', myInit)

	.then(function(response) {	
		return response.json();
	})
	
	.then(function(jsonResponse) {	
		var noApps = jsonResponse.application.length;
		
		var jsonStr = '{"_id":"' + userId + '"';
		
		for (i=0;i<noApps;i++) {
			jsonStr += ',"' + jsonResponse.application[i].id + '":{}';
		}

		jsonStr += "}";
		
		var obj = JSON.parse(jsonStr);	
		
		console.log(obj);
	
		for(i=0;i<noApps;i++) {
			obj[jsonResponse.application[i].id].revincidents=document.getElementById(jsonResponse.application[i].id + "_revincidents").value;
			
			obj[jsonResponse.application[i].id].revperminute=document.getElementById(jsonResponse.application[i].id + "_revperminute").value;
			
			obj[jsonResponse.application[i].id].mttr=document.getElementById(jsonResponse.application[i].id + "_mttr").value;
			
			obj[jsonResponse.application[i].id].allincidents=document.getElementById(jsonResponse.application[i].id + "_allincidents").value;
			
			obj[jsonResponse.application[i].id].itstaffhours=document.getElementById(jsonResponse.application[i].id + "_itstaffhours").value;			
			
			obj[jsonResponse.application[i].id].itstaffnum=document.getElementById(jsonResponse.application[i].id + "_itstaffnum").value;
			
			obj[jsonResponse.application[i].id].svcdeskpermonth=document.getElementById(jsonResponse.application[i].id + "_svcdeskpermonth").value;
			
			obj[jsonResponse.application[i].id].currentslapenalties=document.getElementById(jsonResponse.application[i].id + "_currentslapenalties").value;
			
			obj[jsonResponse.application[i].id].currenttimeslareport=document.getElementById(jsonResponse.application[i].id + "_currenttimeslareport").value;	

			
			if (jsonResponse.application[i].application_users == "internal") {
				obj[jsonResponse.application[i].id].numusers=document.getElementById(jsonResponse.application[i].id + "_numusers").value;
				
				obj[jsonResponse.application[i].id].bustransperday=document.getElementById(jsonResponse.application[i].id + "_bustransperday").value;
				
				obj[jsonResponse.application[i].id].busincidents=document.getElementById(jsonResponse.application[i].id + "_busincidents").value;
				
				obj[jsonResponse.application[i].id].bustransavgtime=document.getElementById(jsonResponse.application[i].id + "_bustransavgtime").value;		
			}
		}

		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Accept", "application/json");
	
		var myInit = { method: 'POST',
			headers: myHeaders,
			cache: 'default',
			body: JSON.stringify(obj)
		};

		fetch('/insertApplicationDetails', myInit)
		
		.then(function(response) {	
			return response;
		})


		
	})
}

function retrieveApplicationDetails() {
	userId = getUserId();
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("userId", userId);
	
	var myInit = { method: 'GET',
        headers: myHeaders,
        cache: 'default'
	};
	
	fetch('/getApplicationDetails', myInit)

	.then(function(response) {	
		return response.json();
	})	
	
	.then(function(jsonResponse) {
		userId = getUserId();
		
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Accept", "application/json");
		myHeaders.append("userId", userId);
		
		var myInit = { method: 'GET',
			headers: myHeaders,
			cache: 'default'
		};
		
		fetch('/getApplications', myInit)

		.then(function(response) {	
			return response.json();
		})
		
		.then(function(gotApplications) {
			if(jsonResponse[0] == undefined){
			
			}
		
			else {
			
			var noApps = gotApplications.application.length;
						
			for (i=0;i<noApps;i++) {
				if(document.getElementById("it_downtime").checked == true) {
					document.getElementById(gotApplications.application[i].id + "_revincidents").value=jsonResponse[0][gotApplications.application[i].id].revincidents;
					document.getElementById(gotApplications.application[i].id + "_revperminute").value=jsonResponse[0][gotApplications.application[i].id].revperminute;	
					document.getElementById(gotApplications.application[i].id + "_mttr").value=jsonResponse[0][gotApplications.application[i].id].mttr;
				}
				
				if(document.getElementById("incident_frequency").checked == true) {
					document.getElementById(gotApplications.application[i].id + "_allincidents").value=jsonResponse[0][gotApplications.application[i].id].allincidents;	
					document.getElementById(gotApplications.application[i].id + "_itstaffhours").value=jsonResponse[0][gotApplications.application[i].id].itstaffhours;
					document.getElementById(gotApplications.application[i].id + "_itstaffnum").value=jsonResponse[0][gotApplications.application[i].id].itstaffnum;	
				}
				
				if(document.getElementById("service_desk").checked == true) {
					document.getElementById(gotApplications.application[i].id + "_svcdeskpermonth").value=jsonResponse[0][gotApplications.application[i].id].svcdeskpermonth;
				}
				
				if(document.getElementById("sla_compliance").checked == true) {
					document.getElementById(gotApplications.application[i].id + "_currentslapenalties").value=jsonResponse[0][gotApplications.application[i].id].currentslapenalties;	
					document.getElementById(gotApplications.application[i].id + "_currenttimeslareport").value=jsonResponse[0][gotApplications.application[i].id].currenttimeslareport;
				}
				
				if(document.getElementById("employee_productivity").checked == true) {
					if(gotApplications.application[i].application_users == "internal") {
						document.getElementById(gotApplications.application[i].id + "_numusers").value=jsonResponse[0][gotApplications.application[i].id].numusers;
						document.getElementById(gotApplications.application[i].id + "_bustransperday").value=jsonResponse[0][gotApplications.application[i].id].bustransperday;	
						document.getElementById(gotApplications.application[i].id + "_busincidents").value=jsonResponse[0][gotApplications.application[i].id].busincidents;
						document.getElementById(gotApplications.application[i].id + "_bustransavgtime").value=jsonResponse[0][gotApplications.application[i].id].bustransavgtime;	
					}	
				}
			}

			}	
		})
	
	})
}

function buildResults() {
	
	document.getElementById("reportContent").style.display="none";
	document.getElementById("resultLoader").style.display="block";
	
	var userId = getUserId();

	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	

	var options = fetch('/getOptions', init).then(function(response){
			
			 return response.json()
	})
	
	.then(function(obj) {
		document.getElementById("cost_comparison").innerHTML='<table class="table" id="cost_comparison_table"><tr><th>Benefit area</th><th>Pre Dynatrace</th><th>Post Dynatrace</th><th>Improvement (%)</th></tr></table><br />';
		resultHeader();
		
		if(obj.it_downtime == true) {resultDownTimeBenefit()}
		if(obj.employee_productivity == true) {resultEmployeeProdBenefit()}
		if(obj.incident_frequency == true) {resultIncidentFreqBenefit()}
		if(obj.service_desk == true) {resultSvcDeskBenefit()}
		if(obj.sla_compliance == true) {resultSlaBenefit()}
		buildResultSummary("cost_savings_norm", 1);
		buildResultSummary("cost_savings_high", 2);
		buildResultSummary("cost_savings_low", 3);
		
	})
	
	.then(function() {
		financialAnalysis();
	})
	
	.then(function() {
		$('#reportContent').hide().fadeIn(500);
		document.getElementById("resultLoader").style.display="none";
	})
}

function resultHeader() {
	
	var userId = getUserId();

	var result_header = document.getElementById("result_header");
	var result_assumptions = document.getElementById("result_assumptions");
	var intro = document.getElementById("intro");

	
	result_assumptions.innerHTML='<table class="table" id="assumptions_table"><tr><th>Assumptions used in calculations</th><th>Figures used</th><th>Dynatrace customer averages</th></tr></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var options = fetch('/getOptions', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var generalDetails = fetch('/getGeneralDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"options":{},"expectedBenefits":{},"generalDetails":{}};
	Promise.all([options,expectedBenefits, generalDetails]).then(function(values){
		combinedData["options"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["generalDetails"] = values[2];
				
		return combinedData;
	})
	
	.then(function(obj) {
		
		newHTML = "";
		
		if(obj.options.company_name == "") { newHTML += "<h2>Dynatrace Business Value Assessment</h2>" }
		else{ newHTML += "<h2>" + obj.options.company_name + " - Dynatrace Business Value Assessment</h2>" }
		
		newHTML += "<br />";
		
		result_header.innerHTML=newHTML;
		
		var table = document.getElementById("assumptions_table");

		if(obj.options.it_downtime == true){
			var row = table.insertRow();
			var dec_rev_incidents_0 = row.insertCell(0); 
			//dec_rev_incidents_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			dec_rev_incidents_0.innerHTML="Decrease in revenue affecting incidents";
			
			var dec_rev_incidents_1 = row.insertCell(1);  
			//dec_rev_incidents_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px;"); 
			dec_rev_incidents_1.innerHTML = obj.expectedBenefits.dec_rev_incidents + '%'; 
			
			var dec_rev_incidents_2 = row.insertCell(2); 
			//dec_rev_incidents_2.setAttribute("style","padding-top: 5px; padding-bottom: 5px;"); 
			dec_rev_incidents_2.innerHTML = '50%'; 
			
			var row = table.insertRow();
			var reduce_downtime_0 = row.insertCell(0); 
			//reduce_downtime_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_downtime_0.innerHTML='Reduction in downtime';		
			
			var reduce_downtime_1 = row.insertCell(1); 
			//reduce_downtime_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_downtime_1.innerHTML=obj.expectedBenefits.reduce_downtime + '%';
			
			var reduce_downtime_2 = row.insertCell(2); 
			//reduce_downtime_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_downtime_2.innerHTML = '40%'; 
			
			
		}
		
		if(obj.options.employee_productivity == true) {
			var row = table.insertRow();
			var increase_employee_prod_0 = row.insertCell(0); 
			//increase_employee_prod_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			increase_employee_prod_0.innerHTML='Increased employee productivity';		
			
			var increase_employee_prod_1 = row.insertCell(1); 
			//increase_employee_prod_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			increase_employee_prod_1.innerHTML=obj.expectedBenefits.increase_employee_prod + '%';
			
			var reduce_downtime_2 = row.insertCell(2); 
			//reduce_downtime_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_downtime_2.innerHTML = '15%'; 
		}
		
		if(obj.options.incident_frequency == true) {
			var row = table.insertRow();
			var decrease_user_incidents_0 = row.insertCell(0); 
			//decrease_user_incidents_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			decrease_user_incidents_0.innerHTML='Decrease in incidents that affect all end users';		
			
			var decrease_user_incidents_1 = row.insertCell(1); 
			//decrease_user_incidents_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			decrease_user_incidents_1.innerHTML=obj.expectedBenefits.decrease_user_incidents + '%';
			
			var reduce_downtime_2 = row.insertCell(2); 
			//reduce_downtime_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_downtime_2.innerHTML = '50%'; 
			
			var row = table.insertRow();
			var reduce_incident_resolve_0 = row.insertCell(0); 
			//reduce_incident_resolve_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_incident_resolve_0.innerHTML='Reduce the resources taken to resolve incidents';		
			
			var reduce_incident_resolve_1 = row.insertCell(1); 
			//reduce_incident_resolve_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_incident_resolve_1.innerHTML=obj.expectedBenefits.reduce_incident_resolve + '%';
			
			var reduce_incident_resolve_2 = row.insertCell(2);  
			//reduce_incident_resolve_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_incident_resolve_2.innerHTML = '50%'; 
			
			
		}
		
		if(obj.options.service_desk == true) {
			var row = table.insertRow();
			var reduce_service_desk_0 = row.insertCell(0); 
			//reduce_service_desk_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_service_desk_0.innerHTML='Reduce the volume of service desk calls';		
			
			var reduce_service_desk_1 = row.insertCell(1); 
			//reduce_service_desk_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_service_desk_1.innerHTML=obj.expectedBenefits.reduce_service_desk + '%';
			
			var reduce_service_desk_2 = row.insertCell(2); 
			//reduce_service_desk_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_service_desk_2.innerHTML = '50%'; 
		}
		
		if(obj.options.sla_compliance == true) {
			var row = table.insertRow();
			var reduce_sla_penalties_0 = row.insertCell(0); 
			//reduce_sla_penalties_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_sla_penalties_0.innerHTML='Reduce SLA penalties';		
			
			var reduce_sla_penalties_1 = row.insertCell(1); 
			//reduce_sla_penalties_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_sla_penalties_1.innerHTML=obj.expectedBenefits.reduce_sla_penalties + '%';
			
			var reduce_sla_penalties_2 = row.insertCell(2);  
			//reduce_sla_penalties_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_sla_penalties_2.innerHTML = '50%'; 
			
			var row = table.insertRow();
			var reduce_sla_resources_0 = row.insertCell(0); 
			//reduce_sla_resources_0.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_sla_resources_0.innerHTML='Reduce resources needed to produce SLA reports';		
			
			var reduce_sla_resources_1 = row.insertCell(1); 
			//reduce_sla_resources_1.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			reduce_sla_resources_1.innerHTML=obj.expectedBenefits.reduce_sla_resources + '%';
			
			var reduce_sla_resources_2 = row.insertCell(2); 
			//reduce_sla_resources_2.setAttribute("style","width: 125px; padding-top: 5px; padding-bottom: 5px;"); 
			reduce_sla_resources_2.innerHTML = '50%'; 
		}
		
		if(obj.options.cloud_bill == true) {
 		
		}
			
		if(obj.options.speed_market) {
		
		}	
		
		intro.innerHTML='In order to provide the ROI values in this report, several assumptions were provided so that a £ value could be assigned against the benefits that you can attain from working with Dynatrace. <br /><br /><ul class="list"><li>A typical IT resource works <b>' + obj.generalDetails.bus_days + ' days</b> per year.</li><li>During a working day, an IT resource works <b>7.5 hours</b>.</li><li>The average loaded salary of an IT resource is <b>£' + addCommas(obj.generalDetails.avg_salary) + '</b></li><li>The cost to handle a service desk call is <b>£' + obj.generalDetails.svc_desk_cost + '</b></li><li>The discount rate for Net Present Value is <b>' + obj.generalDetails.npv + '%</b></li></ul><br /> Because the expected benefits can not be fully proven yet, a confidence factor of <b>' + obj.generalDetails.confidence + '%</b> has been chosen to show how benefits may vary. <br /><br />';
		 
	})
}

function resultDownTimeBenefit() {
	var userId = getUserId();

	var result_header = document.getElementById("result_header");
	var result_assumptions = document.getElementById("result_assumptions");
	var result_itdowntime = document.getElementById("result_itdowntime");
	
	itdowntime_header.innerHTML='<h3>Revenue lost from IT downtime</h3><p>When an application is not available to users, revenue is directly impacted. Whether this is direct impact of the user being able to purchase or a critical system that supports users making revenue generating transactions. Dynatrace enables you to firstly decrease the number of incidents that affect end-users, and secondly reduce the time taken to solve those issues.</p>';
	result_itdowntime.innerHTML='<h4>Results</h4><table class="table" id="result_itdowntime_benefit"><tr><th>Application</th><th>Monthly benefit</th><th>High range</th><th>Low range</th></tr></table><br /><br />';
	result_itdowntime_sec.innerHTML='<h4>Assumptions</h4><table class="table" id="result_itdowntime_assumptions"><th>Application</th><th>Incidents/month</th><th>Revenue lost/minute (£)</th><th>Mean-time-to-repair (mins)</th></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var applications = fetch('/getApplications', init).then(function(response){
			 return response.json()
	});

	var applicationDetails = fetch('/getApplicationDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"applications":{},"applicationDetails":{}};
	Promise.all([general,expectedBenefits, applications, applicationDetails]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["applications"] = values[2];
		combinedData["applicationDetails"] = values[3];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var table = document.getElementById("result_itdowntime_benefit");
		var table2 = document.getElementById("result_itdowntime_assumptions");
		
		var keys = Object.keys(obj.applicationDetails[0]);
		
		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;
		var preDynaTotal = 0;
		var postDynaTotal = 0;
		
		for(i=0; i<obj.applications.application.length;i++) {
			
			for(x=1; x<keys.length; x++) {
				
				if(keys[x].toString() == obj.applications.application[i].id) {
					var thisApp = keys[x];
					break;
				}
			}
			
			var preDyna = obj.applicationDetails[0][thisApp].revincidents * obj.applicationDetails[0][thisApp].mttr * obj.applicationDetails[0][thisApp].revperminute;
			
	
			var revFactor = 1 - (obj.expectedBenefits.dec_rev_incidents / 100);
			var downtimeFactor = 1 - (obj.expectedBenefits.reduce_downtime / 100);
			
			var postDyna = (obj.applicationDetails[0][thisApp].revincidents * revFactor) * (obj.applicationDetails[0][thisApp].mttr) * downtimeFactor * obj.applicationDetails[0][thisApp].revperminute;
		
		
			preDynaTotal = preDynaTotal + preDyna;
			postDynaTotal = postDynaTotal + postDyna;
		
			var monthly = preDyna - postDyna;
			var monthlyLow = monthly * (obj.general.confidence/100);
			var monthlyHigh = monthly * (1-obj.general.confidence/100) + monthly;
			
			var downTimeTotal = downTimeTotal + monthly;
			var downTimeLow = downTimeLow + monthlyLow;
			var downTimeHigh = downTimeHigh + monthlyHigh;		
		
			var row = table.insertRow();
			var appname = row.insertCell(0); 
			//appname.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			appname.innerHTML=obj.applications.application[i].application_name;			
			
			var monthlybenefit = row.insertCell(1); 
			//monthlybenefit.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			monthlybenefit.innerHTML='£' + addCommas(parseInt(monthly));		

			var highrange = row.insertCell(2); 
			//highrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			highrange.innerHTML='£' + addCommas(parseInt(monthlyHigh));	

			var lowrange = row.insertCell(3); 
			//lowrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			lowrange.innerHTML='£' + addCommas(parseInt(monthlyLow));	
			
			
			
			var row = table2.insertRow();
			var applicationName = row.insertCell(0);
			//applicationName.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			applicationName.innerHTML=obj.applications.application[i].application_name;	
			
			var incidents = row.insertCell(1);
			//incidents.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			incidents.innerHTML=obj.applicationDetails[0][thisApp].revincidents;	
			
			var revenue = row.insertCell(2);
			//revenue.setAttribute("style","padding-top: 5px; padding-bottom: 5px");
			revenue.innerHTML=obj.applicationDetails[0][thisApp].revperminute;				
			
			var mttr = row.insertCell(3);
			//mttr.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
			mttr.innerHTML=obj.applicationDetails[0][thisApp].mttr;	
							
		}
		
		var totals = table.insertRow();
		var blank = totals.insertCell(0);
		var monthlyTotal = totals.insertCell(1);
		//monthlyTotal.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyTotal.innerHTML='<b>£' + addCommas(parseInt(downTimeTotal)) + '</b>';
		
		var monthlyHigh = totals.insertCell(2);
		//monthlyHigh.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyHigh.innerHTML='<b>£' + addCommas(parseInt(downTimeHigh)) + '</b>';		
		
		var monthlyLow = totals.insertCell(3);
		//monthlyLow.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyLow.innerHTML='<b>£' + addCommas(parseInt(downTimeLow)) + '</b>';
		
		var comparison = document.getElementById("cost_comparison_table");
		var downTimeRow = comparison.insertRow();
		var name = downTimeRow.insertCell(0);
		name.innerHTML = "Lost revenue from IT downtime";
		var pre = downTimeRow.insertCell(1);
		pre.innerHTML = "£" + addCommas(parseInt(preDynaTotal*12));
		var post = downTimeRow.insertCell(2);
		post.innerHTML = "£" + addCommas(parseInt(postDynaTotal*12));	
		var percent = downTimeRow.insertCell(3);
		percent.innerHTML = parseInt((1 - postDynaTotal/preDynaTotal) * 100) + "%";
		
		
	})
}

function resultEmployeeProdBenefit() {
	var userId = getUserId();

	var result_employeeprod = document.getElementById("result_employeeprod");
	var result_employeeprod_sec = document.getElementById("result_employeeprod_sec");
	
	employeeprod_header.innerHTML="<h3>Increased employee productivity</h3><p>Slow performance doesn't just have an impact on revenue, it also means that internal employees cannot be fully productive. If they have to wait long period of time just to do day-to-day transactions, then £s are being lost in un-productive time. By using insight from Dynatrace to make performance improvements, employees can physically get more transactions done during their working day.</p>";
	result_employeeprod.innerHTML='<h4>Results</h4><table class="table" id="result_employeeprod_benefit"><tr><th>Application</th><th>Monthly benefit</th><th>High range</th><th>Low range</th></tr></table><br /><br />';
	result_employeeprod_sec.innerHTML='<h4>Assumptions</h4><table class="table" id="result_employeeprod_assumptions"><th>Application</th><th>Average users</th><th>Transactions executed/day</th><th>Incidents/day</th><th>Average transaction time (s)</th></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var applications = fetch('/getApplications', init).then(function(response){
			 return response.json()
	});

	var applicationDetails = fetch('/getApplicationDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"applications":{},"applicationDetails":{}};
	Promise.all([general,expectedBenefits, applications, applicationDetails]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["applications"] = values[2];
		combinedData["applicationDetails"] = values[3];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var table = document.getElementById("result_employeeprod_benefit");
		var table2 = document.getElementById("result_employeeprod_assumptions");
		
		var keys = Object.keys(obj.applicationDetails[0]);
		
		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;
		var preDynaTotal = 0;
		var postDynaTotal = 0;
		
		for(i=0; i<obj.applications.application.length;i++) {
			
			for(x=1; x<keys.length; x++) {
				
				if(keys[x].toString() == obj.applications.application[i].id) {
					var thisApp = keys[x];
					break;
				}
			}
			
			if(obj.applications.application[i].application_users == "internal") {
			
				var baseline = obj.applicationDetails[0][thisApp].bustransperday * (obj.applicationDetails[0][thisApp].bustransavgtime /60) * (obj.applicationDetails[0][thisApp].numusers * (obj.applicationDetails[0][thisApp].busincidents/100));
				
				var improvement = baseline * (obj.expectedBenefits.increase_employee_prod/100);
				
				var hoursGain = (improvement/60) * (obj.general.bus_days/12);

				preDynaTotal = preDynaTotal + baseline;
				postDynaTotal = postDynaTotal + improvement;
				
				var monthly = hoursGain * (obj.general.avg_salary / obj.general.bus_days / 7.5);
				var monthlyLow = monthly * (obj.general.confidence/100);
				var monthlyHigh = monthly * (1-obj.general.confidence/100) + monthly;
			
				var downTimeTotal = downTimeTotal + monthly;
				var downTimeLow = downTimeLow + monthlyLow;
				var downTimeHigh = downTimeHigh + monthlyHigh;				
			
				var row = table.insertRow();
				var appname = row.insertCell(0); 
				//appname.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				appname.innerHTML=obj.applications.application[i].application_name;			
				
				var monthlybenefit = row.insertCell(1); 
				//monthlybenefit.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				monthlybenefit.innerHTML='£' + addCommas(parseInt(monthly));		

				var highrange = row.insertCell(2); 
				//highrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				highrange.innerHTML='£' + addCommas(parseInt(monthlyHigh));	

				var lowrange = row.insertCell(3); 
				//lowrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				lowrange.innerHTML='£' + addCommas(parseInt(monthlyLow));	
				
				
				
				var row = table2.insertRow();
				var applicationName = row.insertCell(0);
				//applicationName.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				applicationName.innerHTML=obj.applications.application[i].application_name;	
				
				var numusers = row.insertCell(1);
				//numusers.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				numusers.innerHTML=obj.applicationDetails[0][thisApp].numusers;	
				
				var bustransperday = row.insertCell(2);
				//bustransperday.setAttribute("style","padding-top: 5px; padding-bottom: 5px");
				bustransperday.innerHTML=obj.applicationDetails[0][thisApp].bustransperday;				
				
				var busincidents = row.insertCell(3);
				//busincidents.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				busincidents.innerHTML=obj.applicationDetails[0][thisApp].busincidents;	
				
				var bustransavgtime = row.insertCell(4);
				//bustransavgtime.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				bustransavgtime.innerHTML=obj.applicationDetails[0][thisApp].bustransavgtime;	
								
			}
		}
		
		var totals = table.insertRow();
		var blank = totals.insertCell(0);
		var monthlyTotal = totals.insertCell(1);
		//monthlyTotal.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyTotal.innerHTML='<b>£' + addCommas(parseInt(downTimeTotal)) + '</b>';
		
		var monthlyHigh = totals.insertCell(2);
		//monthlyHigh.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyHigh.innerHTML='<b>£' + addCommas(parseInt(downTimeHigh)) + '</b>';

		var monthlyLow = totals.insertCell(3);
		//monthlyLow.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyLow.innerHTML='<b>£' + addCommas(parseInt(downTimeLow)) + '</b>';
		
		var comparison = document.getElementById("cost_comparison_table");
		var downTimeRow = comparison.insertRow();
		var name = downTimeRow.insertCell(0);
		name.innerHTML = "Increased employee producitivty";
		var pre = downTimeRow.insertCell(1);
		pre.innerHTML = addCommas(parseInt((preDynaTotal*(obj.general.bus_days/12)*12)/60));
		var post = downTimeRow.insertCell(2);
		post.innerHTML = addCommas(parseInt((preDynaTotal*(obj.general.bus_days/12)*12)/60 - (postDynaTotal*(obj.general.bus_days/12)*12)/60));	
		var percent = downTimeRow.insertCell(3);
		percent.innerHTML = parseInt((postDynaTotal/preDynaTotal) * 100) + "%";		
		
	
	})
}

function resultIncidentFreqBenefit() {
	var userId = getUserId();

	var result_incidentfreq = document.getElementById("result_incidentfreq");
	var result_incidentfreq_assumptions = document.getElementById("result_incidentfreq_sec");
	
	incidentfreq_header.innerHTML="<h3>Reduce the frequency and cost of incidents</h3><p>Modern applicatios are big, and more importantly they're complex. When an incident occurs multiple different IT resources can spend multiple hours, this costs money. When an incident happens Dynatrace automatically provides insights on how many users are impacted, what they were doing and what caused the incident - in order to reduce the amount of IT resources required.</p>";
	result_incidentfreq.innerHTML='<h4>Results</h4><table class="table" id="result_incidentfreq_benefit"><tr><th>Application</th><th>Monthly benefit</th><th>High range</th><th>Low range</th></tr></table><br /><br />';
	result_incidentfreq_assumptions.innerHTML='<h4>Assumptions</h4><table class="table" id="result_incidentfreq_assumptions"><th>Application</th><th>Incidents/month</th><th>IT staff hours/incident</th><th>IT staff/incident</th></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var applications = fetch('/getApplications', init).then(function(response){
			 return response.json()
	});

	var applicationDetails = fetch('/getApplicationDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"applications":{},"applicationDetails":{}};
	Promise.all([general,expectedBenefits, applications, applicationDetails]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["applications"] = values[2];
		combinedData["applicationDetails"] = values[3];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var table = document.getElementById("result_incidentfreq_benefit");
		var table2 = document.getElementById("result_incidentfreq_assumptions");
		
		var keys = Object.keys(obj.applicationDetails[0]);
		
		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;		
		var preDynaTotal = 0;
		var postDynaTotal = 0;
		
		for(i=0; i<obj.applications.application.length;i++) {
			
			for(x=1; x<keys.length; x++) {
				
				if(keys[x].toString() == obj.applications.application[i].id) {
					var thisApp = keys[x];
					break;
				}
			}
		
				var preDyna = obj.applicationDetails[0][thisApp].allincidents * (obj.applicationDetails[0][thisApp].itstaffhours * obj.applicationDetails[0][thisApp].itstaffnum) * (obj.general.avg_salary / obj.general.bus_days / 7.5);
				
				
				var postDyna = (obj.applicationDetails[0][thisApp].allincidents * (1 - obj.expectedBenefits.decrease_user_incidents/100)) * ((obj.applicationDetails[0][thisApp].itstaffhours * (1 - obj.expectedBenefits.reduce_incident_resolve/100)) * (obj.applicationDetails[0][thisApp].itstaffnum * (1 - obj.expectedBenefits.reduce_incident_resolve/100))) * (obj.general.avg_salary / obj.general.bus_days / 7.5);

				preDynaTotal = preDynaTotal + preDyna;
				postDynaTotal = postDynaTotal + postDyna;
				
				var monthly = preDyna - postDyna;
				var monthlyLow = monthly * (obj.general.confidence/100);
				var monthlyHigh = monthly * (1-obj.general.confidence/100) + monthly;
			
				var downTimeTotal = downTimeTotal + monthly;
				var downTimeLow = downTimeLow + monthlyLow;
				var downTimeHigh = downTimeHigh + monthlyHigh;			
			
				var row = table.insertRow();
				var appname = row.insertCell(0); 
				//appname.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				appname.innerHTML=obj.applications.application[i].application_name;			
				
				var monthlybenefit = row.insertCell(1); 
				//monthlybenefit.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				monthlybenefit.innerHTML='£' + addCommas(parseInt(monthly));		

				var highrange = row.insertCell(2); 
				//highrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				highrange.innerHTML='£' + addCommas(parseInt(monthlyHigh));	

				var lowrange = row.insertCell(3); 
				//lowrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				lowrange.innerHTML='£' + addCommas(parseInt(monthlyLow));
				
				
				
				var row = table2.insertRow();
				var applicationName = row.insertCell(0);
				//applicationName.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				applicationName.innerHTML=obj.applications.application[i].application_name;	
				
				var allincidents = row.insertCell(1);
				//allincidents.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				allincidents.innerHTML=obj.applicationDetails[0][thisApp].allincidents;	
				
				var itstaffhours = row.insertCell(2);
				//itstaffhours.setAttribute("style","padding-top: 5px; padding-bottom: 5px");
				itstaffhours.innerHTML=obj.applicationDetails[0][thisApp].itstaffhours;				
				
				var itstaffnum = row.insertCell(3);
				//itstaffnum.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				itstaffnum.innerHTML=obj.applicationDetails[0][thisApp].itstaffnum;	
								
			
		}

		var totals = table.insertRow();
		var blank = totals.insertCell(0);
		var monthlyTotal = totals.insertCell(1);
		//monthlyTotal.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyTotal.innerHTML='<b>£' + addCommas(parseInt(downTimeTotal)) + '</b>';
		
		var monthlyHigh = totals.insertCell(2);
		//monthlyHigh.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyHigh.innerHTML='<b>£' + addCommas(parseInt(downTimeHigh)) + '</b>';

		var monthlyLow = totals.insertCell(3);
		//monthlyLow.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyLow.innerHTML='<b>£' + addCommas(parseInt(downTimeLow)) + '</b>';
		
		var comparison = document.getElementById("cost_comparison_table");
		var downTimeRow = comparison.insertRow();
		var name = downTimeRow.insertCell(0);
		name.innerHTML = "Reduced frequency and cost of incidents";
		var pre = downTimeRow.insertCell(1);
		pre.innerHTML = "£" + addCommas(parseInt(preDynaTotal * 12));
		var post = downTimeRow.insertCell(2);
		post.innerHTML = "£" + addCommas(parseInt(postDynaTotal * 12));	
		var percent = downTimeRow.insertCell(3);
		percent.innerHTML = parseInt((1 - postDynaTotal/preDynaTotal) * 100) + "%";		
		
		
	})
}

function resultSvcDeskBenefit() {
	var userId = getUserId();

	var result_svcdesk = document.getElementById("result_svcdesk");
	var result_svcdesk_sec = document.getElementById("result_svcdesk_sec");
	
	svcdesk_header.innerHTML="<h3>Reduce service desk costs</h3><p>Users will call a service desk whenever they have an issue, each call handled has a cost implication even if a resolution cannot be provided. By using Dynatrace to improve user experience, issues are less likely to be encountered and so will decrease the amount of incidents reported by users.</p>";
	result_svcdesk.innerHTML='<h4>Results</h4><table class="table" id="result_svcdesk_benefit"><tr><th>Application</th><th>Monthly benefit</th><th>High range</th><th>Low range</th></tr></table><br /><br />';
	result_svcdesk_sec.innerHTML='<h4>Assumptions</h4><table class="table" id="result_svcdesk_assumptions"><th>Application</th><th>Service desk calls/month</th></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var applications = fetch('/getApplications', init).then(function(response){
			 return response.json()
	});

	var applicationDetails = fetch('/getApplicationDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"applications":{},"applicationDetails":{}};
	Promise.all([general,expectedBenefits, applications, applicationDetails]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["applications"] = values[2];
		combinedData["applicationDetails"] = values[3];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var table = document.getElementById("result_svcdesk_benefit");
		var table2 = document.getElementById("result_svcdesk_assumptions");
		
		var keys = Object.keys(obj.applicationDetails[0]);

		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;	
		var preDynaTotal = 0;
		var postDynaTotal = 0;		
		
		for(i=0; i<obj.applications.application.length;i++) {
			
			for(x=1; x<keys.length; x++) {
				
				if(keys[x].toString() == obj.applications.application[i].id) {
					var thisApp = keys[x];
					break;
				}
			}
		
				var preDyna = obj.applicationDetails[0][thisApp].svcdeskpermonth * obj.general.svc_desk_cost;
				
				var postDyna = ((1 - obj.expectedBenefits.reduce_service_desk/100) * obj.applicationDetails[0][thisApp].svcdeskpermonth) * obj.general.svc_desk_cost;

				preDynaTotal = preDynaTotal + preDyna;
				postDynaTotal = postDynaTotal + postDyna;
				
				var monthly = preDyna - postDyna;
				var monthlyLow = monthly * (obj.general.confidence/100);
				var monthlyHigh = monthly * (1-obj.general.confidence/100) + monthly;
			
				var downTimeTotal = downTimeTotal + monthly;
				var downTimeLow = downTimeLow + monthlyLow;
				var downTimeHigh = downTimeHigh + monthlyHigh;				
			
				var row = table.insertRow();
				var appname = row.insertCell(0); 
				//appname.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				appname.innerHTML=obj.applications.application[i].application_name;			
				
				var monthlybenefit = row.insertCell(1); 
				//monthlybenefit.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				monthlybenefit.innerHTML='£' + addCommas(parseInt(monthly));		

				var highrange = row.insertCell(2); 
				//highrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				highrange.innerHTML='£' + addCommas(parseInt(monthlyHigh));	

				var lowrange = row.insertCell(3); 
				//lowrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				lowrange.innerHTML='£' + addCommas(parseInt(monthlyLow));
				
				
				
				
				var row = table2.insertRow();
				var applicationName = row.insertCell(0);
				//applicationName.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				applicationName.innerHTML=obj.applications.application[i].application_name;	
				
				var svcdeskpermonth = row.insertCell(1);
				//svcdeskpermonth.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				svcdeskpermonth.innerHTML=obj.applicationDetails[0][thisApp].svcdeskpermonth;					
			
		}
		
		var totals = table.insertRow();
		var blank = totals.insertCell(0);
		var monthlyTotal = totals.insertCell(1);
		//monthlyTotal.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyTotal.innerHTML='<b>£' + addCommas(parseInt(downTimeTotal)) + '</b>';
		
		var monthlyHigh = totals.insertCell(2);
		//monthlyHigh.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyHigh.innerHTML='<b>£' + addCommas(parseInt(downTimeHigh)) + '</b>';

		var monthlyLow = totals.insertCell(3);
		//monthlyLow.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyLow.innerHTML='<b>£' + addCommas(parseInt(downTimeLow)) + '</b>';	

		var comparison = document.getElementById("cost_comparison_table");
		var downTimeRow = comparison.insertRow();
		var name = downTimeRow.insertCell(0);
		name.innerHTML = "Decreased service desk costs";
		var pre = downTimeRow.insertCell(1);
		pre.innerHTML = "£" + addCommas(parseInt(preDynaTotal*12));
		var post = downTimeRow.insertCell(2);
		post.innerHTML = "£" + addCommas(parseInt(postDynaTotal*12));	
		var percent = downTimeRow.insertCell(3);
		percent.innerHTML = parseInt((1 - postDynaTotal/preDynaTotal) * 100) + "%";		
		
		
	})
}

function resultSlaBenefit() {
	var userId = getUserId();

	var result_sla = document.getElementById("result_sla");
	var result_sla_sec = document.getElementById("result_sla_sec");
	
	sla_header.innerHTML="<h3>Improve SLA compliance and reporting</h3><p>Service level agreements can be internal/external, as well as formal/informal. When SLAs are formal, penalties are usually incurred through unavailability of systems or poor performance. Reporting on the data to backup how these levels have been met can be time consuming and often manual. Dynatrace can not only provide the insight that helps improve response times and availability, but also produce automatic reports for individual SLAs.</p>";
	result_sla.innerHTML='<h4>Results</h4><table class="table" id="result_sla_benefit"><tr><th>Application</th><th>Monthly benefit</th><th>High range</th><th>Low range</th></tr></table><br /><br />';
	result_sla_sec.innerHTML='<h4>Assumptions</h4><table class="table" id="result_sla_assumptions"><th>Application</th><th>Current SLA penalties (£)</th><th>IT staff hours to produce SLA reports</th></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var applications = fetch('/getApplications', init).then(function(response){
			 return response.json()
	});

	var applicationDetails = fetch('/getApplicationDetails', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"applications":{},"applicationDetails":{}};
	Promise.all([general,expectedBenefits, applications, applicationDetails]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["applications"] = values[2];
		combinedData["applicationDetails"] = values[3];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var table = document.getElementById("result_sla_benefit");
		var table2 = document.getElementById("result_sla_assumptions");
		
		var keys = Object.keys(obj.applicationDetails[0]);
		
		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;			
		var preDynaTotal = 0;
		var postDynaTotal = 0;
		
		for(i=0; i<obj.applications.application.length;i++) {
			
			for(x=1; x<keys.length; x++) {
				
				if(keys[x].toString() == obj.applications.application[i].id) {
					var thisApp = keys[x];
					break;
				}
			}
		
				var penaltiesPreDyna = parseInt(obj.applicationDetails[0][thisApp].currentslapenalties);
				var penaltiesPostDyna = parseInt((1 - obj.expectedBenefits.reduce_sla_penalties/100) * obj.applicationDetails[0][thisApp].currentslapenalties);
				var reportPreDyna = parseInt(obj.applicationDetails[0][thisApp].currenttimeslareport * (obj.general.avg_salary / obj.general.bus_days / 7.5));
				var reportPostDyna = parseInt(((1 - obj.expectedBenefits.reduce_sla_resources/100) * obj.applicationDetails[0][thisApp].currenttimeslareport) * (obj.general.avg_salary / obj.general.bus_days / 7.5));
				
				preDynaTotal = preDynaTotal + penaltiesPreDyna + reportPreDyna;
				postDynaTotal = postDynaTotal + (penaltiesPostDyna + reportPostDyna);				
				
				var monthly = (penaltiesPreDyna - penaltiesPostDyna) + (reportPreDyna - reportPostDyna);
				var monthlyLow = monthly * (obj.general.confidence/100);
				var monthlyHigh = monthly * (1-obj.general.confidence/100) + monthly;
			
				var downTimeTotal = downTimeTotal + monthly;
				var downTimeLow = downTimeLow + monthlyLow;
				var downTimeHigh = downTimeHigh + monthlyHigh;						
			
				var row = table.insertRow();
				var appname = row.insertCell(0); 
				//appname.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				appname.innerHTML=obj.applications.application[i].application_name;			
				
				var monthlybenefit = row.insertCell(1); 
				//monthlybenefit.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				monthlybenefit.innerHTML='£' + addCommas(parseInt(monthly));		

				var highrange = row.insertCell(2); 
				//highrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				highrange.innerHTML='£' + addCommas(parseInt(monthlyHigh));	

				var lowrange = row.insertCell(3); 
				//lowrange.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				lowrange.innerHTML='£' + addCommas(parseInt(monthlyLow));
				
				
				var row = table2.insertRow();
				var applicationName = row.insertCell(0);
				//applicationName.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				applicationName.innerHTML=obj.applications.application[i].application_name;	
				
				var currentslapenalties = row.insertCell(1);
				//currentslapenalties.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				currentslapenalties.innerHTML=addCommas(obj.applicationDetails[0][thisApp].currentslapenalties);	

				var currenttimeslareport = row.insertCell(2);
				//currenttimeslareport.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
				currenttimeslareport.innerHTML=obj.applicationDetails[0][thisApp].currenttimeslareport;				
		}

		var totals = table.insertRow();
		var blank = totals.insertCell(0);
		var monthlyTotal = totals.insertCell(1);
		//monthlyTotal.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyTotal.innerHTML='<b>£' + addCommas(parseInt(downTimeTotal)) + '</b>';
		
		var monthlyHigh = totals.insertCell(2);
		//monthlyHigh.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyHigh.innerHTML='<b>£' + addCommas(parseInt(downTimeHigh)) + '</b>';

		var monthlyLow = totals.insertCell(3);
		//monthlyLow.setAttribute("style","padding-top: 5px; padding-bottom: 5px"); 
		monthlyLow.innerHTML='<b>£' + addCommas(parseInt(downTimeLow)) + '</b>';

		var comparison = document.getElementById("cost_comparison_table");
		var downTimeRow = comparison.insertRow();
		var name = downTimeRow.insertCell(0);
		name.innerHTML = "Increased SLA compliance and reporting";
		var pre = downTimeRow.insertCell(1);
		pre.innerHTML = "£" + addCommas(parseInt(preDynaTotal));
		var post = downTimeRow.insertCell(2);
		post.innerHTML = "£" + addCommas(parseInt(postDynaTotal));	
		var percent = downTimeRow.insertCell(3);
		percent.innerHTML = parseInt((1 - postDynaTotal/preDynaTotal) * 100) + "%";		
		
		
	})
}

function buildResultSummary(table, range) {
	var userId = getUserId();

	var cost_savings = document.getElementById(table);
	
	cost_savings.innerHTML='<table class="table" id="' + table + '_table"><tr><th>Benefit area</th></tr></table>';
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var expectedBenefits = fetch('/getExpectedBenefits', init).then(function(response){
			 return response.json()
	});

	var options = fetch('/getOptions', init).then(function(response) {
			return response.json()
	});
	
	var combinedData = {"general":{},"expectedBenefits":{},"options":{}};
	Promise.all([general,expectedBenefits, options]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["expectedBenefits"] = values[1];
		combinedData["options"] = values[2];
		combinedData["table"] = table;
		combinedData["range"] = range;
		
		return combinedData;
	})
	
	.then(function(obj) {
		var tableVar = obj.table;
		var rangeVar = obj.range;
		years = obj.options.study_period;
		growth = obj.general.rev_growth;
		year = (new Date()).getFullYear();
		var table = document.getElementById(tableVar + "_table");
		var tableHead = document.getElementById(tableVar + "_table").children[0].children[0];

		var yearTotal = [];
		
		for(i=0;i<years;i++) {
			th = document.createElement('th');
			th.innerHTML = year+i;
			tableHead.appendChild(th);
			yearTotal[i] = 0;
		}
		
			th = document.createElement('th');
			th.innerHTML = 'Total';
			tableHead.appendChild(th);
		
		
		var downTimeSum = 0;
		var employeeProdSum = 0;
		var incidentFreqSum =0;
		var svcDeskSum = 0;
		var slaSum = 0;
		
		
		if(obj.options.it_downtime == true) {
			var itdowntime_total = getNumbers(document.getElementById("result_itdowntime_benefit").rows[document.getElementById("result_itdowntime_benefit").rows.length-1].children[rangeVar].innerHTML);
						
			var row = table.insertRow();
			var benefitName = row.insertCell(0); 
			benefitName.innerHTML="Revenue lost from IT downtime";	
			
			for(i=0;i<years;i++) {
				var itdowntime = row.insertCell(i+1); 
				itdowntime.innerHTML="£" + addCommas(parseInt((itdowntime_total * 12) + (itdowntime_total*12 * (i * growth/100))));	
				downTimeSum = downTimeSum + parseInt((itdowntime_total * 12) + (itdowntime_total*12 * (i * growth/100)));
				yearTotal[i] = yearTotal[i] + parseInt((itdowntime_total * 12) + (itdowntime_total*12 * (i * growth/100)));
			}
			
			var itdowntime = row.insertCell(i+1); 
			itdowntime.innerHTML='<b>£' + addCommas(parseInt(downTimeSum)) + '</b>';
		}
		
		if(obj.options.employee_productivity == true) {
			var employeeprod_total = getNumbers(document.getElementById("result_employeeprod_benefit").rows[document.getElementById("result_employeeprod_benefit").rows.length-1].children[rangeVar].innerHTML);
			
			var row = table.insertRow();
			var employeeprod = row.insertCell(0); 
			employeeprod.innerHTML="Increased employee productivity";	
			
			for(i=0;i<years;i++) {
				var employeeprod = row.insertCell(i+1); 
				employeeprod.innerHTML="£" + addCommas(parseInt((employeeprod_total * 12) + (employeeprod_total*12 * (i * growth/100))));	
				employeeProdSum = employeeProdSum + parseInt((employeeprod_total * 12) + (employeeprod_total*12 * (i * growth/100)));
				yearTotal[i] = yearTotal[i] + parseInt((employeeprod_total * 12) + (employeeprod_total*12 * (i * growth/100)));
			}	
			
			var employeeprod = row.insertCell(i+1); 
			employeeprod.innerHTML='<b>£' + addCommas(parseInt(employeeProdSum)) + '</b>';
		}

		if(obj.options.incident_frequency == true) {
			var incidentfreq_total = getNumbers(document.getElementById("result_incidentfreq_benefit").rows[document.getElementById("result_incidentfreq_benefit").rows.length-1].children[rangeVar].innerHTML);
			
			var row = table.insertRow();
			var incidentfreq = row.insertCell(0); 
			incidentfreq.innerHTML="Reduced frequency and cost of incidents";	
			
			for(i=0;i<years;i++) {
				var incidentfreq = row.insertCell(i+1); 
				incidentfreq.innerHTML="£" + addCommas(parseInt((incidentfreq_total * 12) + (incidentfreq_total*12 * (i * growth/100))));	
				incidentFreqSum = incidentFreqSum + parseInt((incidentfreq_total * 12) + (incidentfreq_total*12 * (i * growth/100)));
				yearTotal[i] = yearTotal[i] + parseInt((incidentfreq_total * 12) + (incidentfreq_total*12 * (i * growth/100)));
			}				
			
			var incidentfreq = row.insertCell(i+1); 
			incidentfreq.innerHTML='<b>£' + addCommas(parseInt(incidentFreqSum)) + '</b>';
		}		
		
		if(obj.options.service_desk == true) {
			var svcdesk_total = getNumbers(document.getElementById("result_svcdesk_benefit").rows[document.getElementById("result_svcdesk_benefit").rows.length-1].children[rangeVar].innerHTML);
			
			var row = table.insertRow();
			var svcdesk = row.insertCell(0); 
			svcdesk.innerHTML="Reduced cost of service desk calls";	
			
			for(i=0;i<years;i++) {
				var svcdesk = row.insertCell(i+1); 
				svcdesk.innerHTML="£" + addCommas(parseInt((svcdesk_total * 12) + (svcdesk_total*12 * (i * growth/100))));
				svcDeskSum = svcDeskSum + parseInt((svcdesk_total * 12) + (svcdesk_total*12 * (i * growth/100)));
				yearTotal[i] = yearTotal[i] + parseInt((svcdesk_total * 12) + (svcdesk_total*12 * (i * growth/100)));
			}

			var svcdesk = row.insertCell(i+1); 
			svcdesk.innerHTML='<b>£' + addCommas(parseInt(svcDeskSum)) + '</b>';
		}
		
		if(obj.options.sla_compliance == true) {
			var sla_total = getNumbers(document.getElementById("result_sla_benefit").rows[document.getElementById("result_sla_benefit").rows.length-1].children[rangeVar].innerHTML);
			
			var row = table.insertRow();
			var sla = row.insertCell(0); 
			sla.innerHTML="Improved SLA reporting and compliance";	
			
			for(i=0;i<years;i++) {
				var sla = row.insertCell(i+1); 
				sla.innerHTML="£" + addCommas(parseInt((sla_total * 12) + (sla_total*12 * (i * growth/100))));	
				slaSum = slaSum + parseInt((sla_total * 12) + (sla_total*12 * (i * growth/100)));
				yearTotal[i] = yearTotal[i] + parseInt((sla_total * 12) + (sla_total*12 * (i * growth/100)));
			}	

			var sla = row.insertCell(i+1); 
			sla.innerHTML='<b>£' + addCommas(parseInt(slaSum)) + '</b>';
		}
	
		var totals = table.insertRow();
		var blank = totals.insertCell(0);
			
		grandTotal = 0;
		
		for(i=1;i<parseInt(years)+1;i++) {
			var addYearTotal = totals.insertCell(i);
			addYearTotal.innerHTML='<b>£' + addCommas(parseInt(yearTotal[i-1])) + '</b>';
			grandTotal = grandTotal + parseInt(yearTotal[i-1]);
		}		
		
		var finalTotal = totals.insertCell(i);
		finalTotal.innerHTML='<b>£' + addCommas(parseInt(grandTotal));
	})
}

function financialAnalysis() {
	var userId = getUserId();

	var cost_benefit = document.getElementById("cost_benefit");
	var expected_analysis = document.getElementById("expected_analysis");
	var high_analysis = document.getElementById("high_analysis");
	var low_analysis = document.getElementById("low_analysis");
	
	cost_benefit.innerHTML='<table class="table" id="cost_benefit_table"><tr><th></th></tr></table>';
	expected_analysis.innerHTML='<table class="table" id="expected_analysis_table"><tr><th></th><th></th></tr></table>';
	high_analysis.innerHTML='<table class="table" id="high_analysis_table"><tr><th></th><th></th></tr></table>';
	low_analysis.innerHTML='<table class="table" id="low_analysis_table"><tr><th></th><th></th></tr></table>';
	
	
	var headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("userId", userId);
	
	var init = { method: 'GET',
        headers: headers,
        cache: 'default'
	};	
	
	var general = fetch('/getGeneralDetails', init).then(function(response){ 
			 return response.json()
	});
	
	var productCosts = fetch('/getProductCosts', init).then(function(response){
			 return response.json()
	});

	var options = fetch('/getOptions', init).then(function(response){
			 return response.json()
	});
	
	var combinedData = {"general":{},"productCosts":{},"options":{}};
	Promise.all([general,productCosts, options]).then(function(values){
		combinedData["general"] = values[0];
		combinedData["productCosts"] = values[1];
		combinedData["options"] = values[2];
		
		return combinedData;
	})
	
	.then(function(obj) {
		var cost_benefit_table = document.getElementById("cost_benefit_table");
		var expected_analysis_table = document.getElementById("expected_analysis_table");
		var high_analysis_table = document.getElementById("high_analysis_table");
		var low_analysist_table = document.getElementById("low_analysist_table");
		
		var years = obj.options.study_period;
		year = (new Date()).getFullYear();
		
		var downTimeTotal = 0;
		var downTimeLow = 0;
		var downTimeHigh = 0;			
		var preDynaTotal = 0;
		var postDynaTotal = 0;


		for(i=0;i<years;i++) {
			th = document.createElement('th');
			th.innerHTML = year+i;
			cost_benefit_table.children[0].children[0].appendChild(th);		
		}
			
		th = document.createElement('th');
		th.innerHTML = 'Total';
		cost_benefit_table.children[0].children[0].appendChild(th);
		
		
		totals = document.getElementById("cost_savings_norm_table").rows[document.getElementById("cost_savings_norm_table").rows.length-1];
		benefitsRow = document.getElementById("cost_benefit_table").insertRow();
		var labelBenefit = benefitsRow.insertCell(0);
		labelBenefit.innerHTML='Benefits';
		
		benefitsForNpv = [];
		
		for(i=1;i<parseInt(years)+1;i++) {
			var value = getNumbers(totals.children[i].innerHTML);
			var cell = benefitsRow.insertCell(i);
			benefitsForNpv[i-1] = parseInt(getNumbers(totals.children[i].innerHTML));
			cell.innerHTML='£' + addCommas(value);
		}
		
		var value = getNumbers(totals.children[i].innerHTML);
		var cell = benefitsRow.insertCell(i);
		cell.innerHTML='<b>£' + addCommas(value) + '</b>';
		
		overallBenefitTotal = parseInt(getNumbers(totals.children[i].innerHTML));
		
		costRow = document.getElementById("cost_benefit_table").insertRow();
		var labelCost = costRow.insertCell(0);
		labelCost.innerHTML='Cost';
		
		runningTotal = 0;
		overallTotal = 0;
		
		for(i=1;i<parseInt(years)+1;i++) {
			if(isNaN(parseInt(obj.productCosts[0].costs[i-1].license_fees)) == false) { runningTotal = runningTotal + parseInt(obj.productCosts[0].costs[i-1].license_fees) } 
			if(isNaN(parseInt(obj.productCosts[0].costs[i-1].maintenance)) == false) { runningTotal = runningTotal + parseInt(obj.productCosts[0].costs[i-1].maintenance) } 
			if(isNaN(parseInt(obj.productCosts[0].costs[i-1].hardware)) == false) { runningTotal = runningTotal + parseInt(obj.productCosts[0].costs[i-1].hardware) } 
			if(isNaN(parseInt(obj.productCosts[0].costs[i-1].implementation)) == false) { runningTotal = runningTotal + parseInt(obj.productCosts[0].costs[i-1].implementation) } 
			if(isNaN(parseInt(obj.productCosts[0].costs[i-1].training)) == false) { runningTotal = runningTotal + parseInt(obj.productCosts[0].costs[i-1].training) } 
			var cell = costRow.insertCell(i);
			
			cell.innerHTML='£' + addCommas(runningTotal);
			overallTotal=overallTotal + runningTotal;
			
			
			
			runningTotal=0;
		}		

		var labelCost = costRow.insertCell(i);
		labelCost.innerHTML='<b>£' + addCommas(overallTotal) + '</b>';
		
		
		var normRoiRow = document.getElementById("expected_analysis_table").insertRow();
		var normRoiLabel = normRoiRow.insertCell(0);
		normRoiLabel.innerHTML='ROI over the study period';
		var normRoi = normRoiRow.insertCell(1);
		normRoi.innerHTML=(((overallBenefitTotal - overallTotal)/overallTotal)*100).toFixed(2) + '%';
		
		var finance = new Finance();
		
		var npvRow = document.getElementById("expected_analysis_table").insertRow();
		var npvLabel = npvRow.insertCell(0);
		npvLabel.innerHTML='Net present value (NPV)';
		
		var npvValue = npvRow.insertCell(1);
		
		if(obj.options.study_period == "1") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, benefitsForNpv[0])));
		}
		
		if(obj.options.study_period == "2") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, benefitsForNpv[0] ,benefitsForNpv[1])));
		}

		if(obj.options.study_period == "3") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, benefitsForNpv[0], benefitsForNpv[1], benefitsForNpv[2])));
		}

		if(obj.options.study_period == "4") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, benefitsForNpv[0], benefitsForNpv[1], benefitsForNpv[2], benefitsForNpv[3])));
		}

		if(obj.options.study_period == "5") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, benefitsForNpv[0], benefitsForNpv[1], benefitsForNpv[2], benefitsForNpv[3], benefitsForNpv[4])));
		}		
	
		var y1costs = parseInt(getNumbers(document.getElementById("cost_benefit_table").children[0].children[document.getElementById("cost_benefit_table").rows.length-1].children[1].innerHTML));
	
		var payBackRow = document.getElementById("expected_analysis_table").insertRow();
		var labelBenefit = payBackRow.insertCell(0);
		labelBenefit.innerHTML='Year 1 payback period (months)';		
		
		var y1benefits = parseInt(getNumbers(document.getElementById("cost_benefit_table").children[0].children[document.getElementById("cost_benefit_table").rows.length-2].children[1].innerHTML));
		
		var labelBenefit = payBackRow.insertCell(1);
		labelBenefit.innerHTML=(y1costs / (y1benefits/12)).toFixed(1);		
		
		
		//High range
		highBenefitsForNpv = [];
		totalsHigh = document.getElementById("cost_savings_high_table").rows[document.getElementById("cost_savings_high_table").rows.length-1];
		var highBenefitTotal = parseInt(getNumbers(totalsHigh.children[i].innerHTML));
		
		for(i=1;i<parseInt(years)+1;i++) {
			highBenefitsForNpv[i-1] = parseInt(getNumbers(totalsHigh.children[i].innerHTML));
		}	
		
		var highRoiRow = document.getElementById("high_analysis_table").insertRow();
		var highRoiLabel = highRoiRow.insertCell(0);
		highRoiLabel.innerHTML='ROI over the study period';
		var highRoi = highRoiRow.insertCell(1);
		highRoi.innerHTML=(((highBenefitTotal - overallTotal)/overallTotal)*100).toFixed(2) + '%';
		
		var finance = new Finance();
		
		var npvRow = document.getElementById("high_analysis_table").insertRow();
		var npvLabel = npvRow.insertCell(0);
		npvLabel.innerHTML='Net present value (NPV)';
		
		var npvValue = npvRow.insertCell(1);
		
		if(obj.options.study_period == "1") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, highBenefitsForNpv[0])));
		}
		
		if(obj.options.study_period == "2") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, highBenefitsForNpv[0] ,highBenefitsForNpv[1])));
		}

		if(obj.options.study_period == "3") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, highBenefitsForNpv[0], highBenefitsForNpv[1], highBenefitsForNpv[2])));
		}

		if(obj.options.study_period == "4") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, highBenefitsForNpv[0], highBenefitsForNpv[1], highBenefitsForNpv[2], highBenefitsForNpv[3])));
		}

		if(obj.options.study_period == "5") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, highBenefitsForNpv[0], highBenefitsForNpv[1], highBenefitsForNpv[2], highBenefitsForNpv[3], highBenefitsForNpv[4])));
		}		
	
		var highPayBackRow = document.getElementById("high_analysis_table").insertRow();
		var labelHighBenefit = highPayBackRow.insertCell(0);
		labelHighBenefit.innerHTML='Year 1 payback period (months)';		
		
		var y1Highbenefits = parseInt(getNumbers(document.getElementById("cost_savings_high_table").children[0].children[document.getElementById("cost_savings_high_table").rows.length-1].children[1].innerHTML));
		
		var labelHighBenefit = highPayBackRow.insertCell(1);
		labelHighBenefit.innerHTML=(y1costs / (y1Highbenefits/12)).toFixed(1);			
		
		//Low range
		
		lowBenefitsForNpv = [];
		totalsLow = document.getElementById("cost_savings_low_table").rows[document.getElementById("cost_savings_low_table").rows.length-1];
		var lowBenefitTotal = parseInt(getNumbers(totalsLow.children[i].innerHTML));
		
		for(i=1;i<parseInt(years)+1;i++) {
			lowBenefitsForNpv[i-1] = parseInt(getNumbers(totalsLow.children[i].innerHTML));
		}	
		
		var lowRoiRow = document.getElementById("low_analysis_table").insertRow();
		var lowRoiLabel = lowRoiRow.insertCell(0);
		lowRoiLabel.innerHTML='ROI over the study period';
		var lowRoi = lowRoiRow.insertCell(1);
		lowRoi.innerHTML=(((lowBenefitTotal - overallTotal)/overallTotal)*100).toFixed(2) + '%';
		
		var finance = new Finance();
		
		var npvRow = document.getElementById("low_analysis_table").insertRow();
		var npvLabel = npvRow.insertCell(0);
		npvLabel.innerHTML='Net present value (NPV)';
		
		var npvValue = npvRow.insertCell(1);
		
		if(obj.options.study_period == "1") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, lowBenefitsForNpv[0])));
		}
		
		if(obj.options.study_period == "2") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, lowBenefitsForNpv[0] ,lowBenefitsForNpv[1])));
		}

		if(obj.options.study_period == "3") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, lowBenefitsForNpv[0], lowBenefitsForNpv[1], lowBenefitsForNpv[2])));
		}

		if(obj.options.study_period == "4") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, lowBenefitsForNpv[0], lowBenefitsForNpv[1], lowBenefitsForNpv[2], lowBenefitsForNpv[3])));
		}

		if(obj.options.study_period == "5") {
			npvValue.innerHTML='£' + addCommas(parseInt(finance.NPV(obj.general.npv, overallTotal*-1, lowBenefitsForNpv[0], lowBenefitsForNpv[1], lowBenefitsForNpv[2], lowBenefitsForNpv[3], lowBenefitsForNpv[4])));
		}		
	
		var lowPayBackRow = document.getElementById("low_analysis_table").insertRow();
		var labelLowBenefit = lowPayBackRow.insertCell(0);
		labelLowBenefit.innerHTML='Year 1 payback period (months)';		
		
		var y1Lowbenefits = parseInt(getNumbers(document.getElementById("cost_savings_low_table").children[0].children[document.getElementById("cost_savings_low_table").rows.length-1].children[1].innerHTML));
		
		var labelLowBenefit = lowPayBackRow.insertCell(1);
		labelLowBenefit.innerHTML=(y1costs / (y1Lowbenefits/12)).toFixed(1);		
		
		
		
		
	})
}

	<table class="table" style="margin-left: 5%; margin-right: 10%">
	  <thead>
		<tr>
		  <th></th>
		  <th>Year 1</th>
		  <th>Year 2</th>
		  <th>Year 3</th>
		  <th><b>Total</b></th>
		</tr>
	  </thead>
	  <tbody>
		<tr style="background-color: #9355b7; color: white;">
		  <td style="padding-left: 2px; padding-right: 2px"><img src="/static/biz.svg" style="width: 20px; height: 20px"> Biz</td>
		  <td style="padding-left: 2px; padding-right: 2px">£2,107,500</td>
		  <td style="padding-left: 2px; padding-right: 2px">£2,360,400</td>
		  <td style="padding-left: 2px; padding-right: 2px">£2,643,648</td>
		  <td style="padding-left: 2px; padding-right: 2px">£7,111,548</td>
		</tr>
		<tr style="background-color: #73be28; color: white">
		  <td><img src="/static/ops.svg" style="width: 20px; height: 20px"> Ops</td>
		  <td>£1,687,642</td>
		  <td>£2,336,059</td>
		  <td>£2,521,387</td>
		  <td>£6,545,088</td>
		</tr>
		<tr style="background-color: #1496ff; color: white">
		  <td><img src="/static/dev.svg" style="width: 20px; height: 20px"> Dev</td>
		  <td>£564,720</td>
		  <td>£632,486</td>
		  <td>£708,385</td>
		  <td>£1,905,591</td>
		</tr>
	  </tbody>
	</table>