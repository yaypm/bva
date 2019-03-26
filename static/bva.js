function seCheck() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	//myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		mode: 'no-cors',
		credentials: 'same-origin'
	}

	fetch('/seCheck', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
		if(jsonResponse.status == "se") {
			console.log("is se");
		}
		else {
			console.log("not se");
		}
		console.log(jsonResponse.status);
	})
}

function sortMe(arr) {
	var sortable = [];
	for (var conv in arr) {
	 sortable.push([conv, arr[conv]]);
	}

	sortable.sort(function(a, b) {
	 return a[1] - b[1];
	});	
	
	return sortable;
}

function sortMeOpps(arr) {
	arr.sort(function(obj1, obj2) {
		return obj1.total - obj2.total;
	});
}

function enableSeOppSearch() {
	$(" #se_search ").click(function() {
		$(".status-success").css("display", "none");
		$(".status-failure").css("display", "none");
		seOppSearch();
	});
}

function seOppSearch() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");

	var search={lead_sales: document.getElementById("lead_sales").value,
			lead_se: document.getElementById("lead_se").value,
			business_champion: document.getElementById("business_champion").value,
			technical_champion: document.getElementById("technical_champion").value,
			tenant: document.getElementById("tenant").value};

	options = ["saas","managed","offline","windows","linux","aix","solaris","vmware","azure","aws","openshift","cloudfoundry","ibmcloud","oraclecloud","gcp","heroku","openstack","kubernetes","iaas","paas","faas","softaas","java","dotnet","php","nodejs","messaging","c","dotnetcore","webserver","golang","mainframe","web","mobileapp","thick","citrix","browser","http","external","oaplugins","cnd","agplugins","externalevents","incidents","cmdb","cloud","onprem","hybrid","docker","iib","python","api","iot"];

	for(i=0;i<options.length;i++) {
		if(document.getElementById(options[i]).checked == true) {
			search[options[i]] = true;
		}
	}

	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(search)
	}

	fetch('/seOppSearch', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {

	if(jsonResponse.status != "failed") {
	
		document.getElementById("filters").classList.remove("is-active");

		$('#search_results').css("display", "block");

		for(i=0;i<document.getElementById("opp_results").tBodies.length;i++) {
			if(jsonResponse[i] != undefined) {
				var outcomesTotal = jsonResponse[i].trends + jsonResponse[i].causation + jsonResponse[i].digital + jsonResponse[i].bi + jsonResponse[i].market;
				var outcomesProg = Math.ceil((outcomesTotal / 15) * 100);
				
				var autonomousTotal = jsonResponse[i].driving + jsonResponse[i].healing + jsonResponse[i].culture + jsonResponse[i].automation + jsonResponse[i].bill;
				var autonomousProg = Math.ceil((autonomousTotal / 15) * 100);
				
				var fullStackTotal = jsonResponse[i].tool_cons + jsonResponse[i].devops + jsonResponse[i].ai + jsonResponse[i].integrations + jsonResponse[i].release + jsonResponse[i].lifecycle + jsonResponse[i].shift + jsonResponse[i].perfect + jsonResponse[i].migration + jsonResponse[i].transaction;
				var fullStackProg = Math.ceil((fullStackTotal / 30) * 100);

				jsonResponse[i].total = outcomesTotal + autonomousTotal + fullStackTotal;
			}
		}

		orderedOpps = jsonResponse.sort(function(obj1, obj2) {
			return obj2.total - obj1.total;
		});	

		for(i=0;i<document.getElementById("opp_results").tBodies.length;i++) {
			if(orderedOpps[i] != undefined) {
				document.getElementById("opp_results").tBodies[i].style.display="table-row-group";
				var outcomesTotal = orderedOpps[i].trends + orderedOpps[i].causation + orderedOpps[i].digital + orderedOpps[i].bi + orderedOpps[i].market;
				var outcomesProg = Math.ceil((outcomesTotal / 15) * 100);
				
				var autonomousTotal = orderedOpps[i].driving + orderedOpps[i].healing + orderedOpps[i].culture + orderedOpps[i].automation + orderedOpps[i].bill;
				var autonomousProg = Math.ceil((autonomousTotal / 15) * 100);
				
				var fullStackTotal = orderedOpps[i].tool_cons + orderedOpps[i].devops + orderedOpps[i].ai + orderedOpps[i].integrations + orderedOpps[i].release + orderedOpps[i].lifecycle + orderedOpps[i].shift + orderedOpps[i].perfect + orderedOpps[i].migration + orderedOpps[i].transaction;
				var fullStackProg = Math.ceil((fullStackTotal / 30) * 100);

				document.getElementById("opp_results").tBodies[i].children[0].children[0].innerHTML="<input type=\"hidden\" class=\"hiddenSeId\" name=\"hiddenSeId\" value=\"" + orderedOpps[i]._id + "\">" + orderedOpps[i].company;
				document.getElementById("opp_results").tBodies[i].children[0].children[1].innerHTML="<div class=\"theme--purple\"><label class=\"label--purple\" for=\"p0\">" + outcomesTotal + "/15</label><progress class=\"progressbar\" value=\"" + outcomesProg + "\" max=\"100\" id=\"p0\"></progress></div>";
				document.getElementById("opp_results").tBodies[i].children[0].children[2].innerHTML="<div class=\"theme--green\"><label class=\"label--purple\" for=\"p0\">" + autonomousTotal + "/15</label><progress class=\"progressbar\" value=\"" + autonomousProg + "\" max=\"100\" id=\"p0\"></progress></div>";
				document.getElementById("opp_results").tBodies[i].children[0].children[3].innerHTML="<div class=\"theme--blue\"><label class=\"label--purple\" for=\"p0\">" + fullStackTotal + "/30</label><progress class=\"progressbar\" value=\"" + fullStackProg + "\" max=\"100\" id=\"p0\"></progress></div>";
				
				if(orderedOpps[i].lead_sales != "") {
					lead_sales = orderedOpps[i].lead_sales;
				}
				else {
					lead_sales = "n/a";
				}

				if(orderedOpps[i].lead_se != "") {
					lead_se = orderedOpps[i].lead_se;
				}
				else {
					lead_se = "n/a";
				}				

				document.getElementById("opp_results").tBodies[i].children[1].children[0].innerHTML="<div class=\"divTable\" style=\"font-size: 1.2em\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\"><b>Lead sales</b> <br /><div style=\"font-size: 1.5em\">" + lead_sales + "</div></div><div class=\"divTableCell\"><b>Lead SE</b><br /><div style=\"font-size: 1.5em\">" + lead_se + "</div></div><div class=\"divTableCell\"><a href=\"/workflow_se?se_id=" + orderedOpps[i]._id + "#technical\"><button role=\"button\" type=\"button\" class=\"btn btn--secondary theme--dark\">Go to SE app</button></a><br /><br /><a href=\"/\" id=\"" + orderedOpps[i]._id + "\" class=\"bvaClickThrough\" style=\"display: none\"><button role=\"button\" type=\"button\" class=\"btn btn--secondary theme--dark\">Go to BVA</button></a></div></div></div>";
				
			}
		
		
			else {
				document.getElementById("opp_results").tBodies[i].style.display="none";
			}			
		}

		//document.getElementById("search_results").scrollIntoView();
		

		}
		else {
			$('#no_search_results').css("display", "block");
			var results = 0;
		}

		})
	
	.then(function() {
		if(results = 0) {
			getBvaForClickThrough();
		}
	})
}

function getBvaForClickThrough() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");

	var loop = document.getElementsByClassName("bvaClickThrough");
	var search = [];

	for(i=0;i<loop.length;i++) {
		search.push({_id: loop[i].id});
	}

	var myInit = { method: 'POST',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin',
		body: JSON.stringify(search)
	}

	fetch('/getBvaFromSe', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
		jsonResponse.forEach(function(item) {
			
			for(i=0;i<loop.length;i++) {
				
				if(item._id == loop[i].id) {
					if(item.bva_id == null || item.bva_id == "" || item.bva_id == undefined) {

					}
					else {
						loop[i].href="/workflow?bva_id=" + item.bva_id + "#biz";
						loop[i].style.display = "block";
					}	
				}
			}
		})
	})

}

function enableSeBvaSearch() {
	$(" #user_search ").click(function() {
		$(".status-success").css("display", "none");
		$(".status-failure").css("display", "none");
		document.getElementById("many_result").style.display = "none";
		document.getElementById("no_result").style.display = "none";
		document.getElementById("results").innerHTML = "";
		seBvaSearch();
	});
}

function seSearchMenuSwitch() {
	window.addEventListener("hashchange", onLoadAndHashChange, false);
}

function onLoadAndHashChange() {
	var anchor = window.location.hash.substr(1);
	if(anchor == "people") {
		document.getElementById("people").style.display="flex";
		document.getElementById("approach").style.display="none";
		document.getElementById("platform").style.display="none";
		document.getElementById("application").style.display="none";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[0].className="tab is-active";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[1].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[2].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[3].className="tab";
		return false;
	}
	if(anchor == "approach") {
		document.getElementById("people").style.display="none";
		document.getElementById("approach").style.display="flex";
		document.getElementById("platform").style.display="none";
		document.getElementById("application").style.display="none";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[0].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[1].className="tab is-active";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[2].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[3].className="tab";
		return false;
	}
	if(anchor == "platform") {
		document.getElementById("people").style.display="none";
		document.getElementById("approach").style.display="none";
		document.getElementById("platform").style.display="flex";
		document.getElementById("application").style.display="none";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[0].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[1].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[2].className="tab is-active";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[3].className="tab";
		return false;
	}
	if(anchor == "application") {
		document.getElementById("people").style.display="none";
		document.getElementById("approach").style.display="none";
		document.getElementById("platform").style.display="none";
		document.getElementById("application").style.display="flex";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[0].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[1].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[2].className="tab";
		document.getElementsByClassName("tabs")[0].getElementsByTagName("button")[3].className="tab is-active";
		return false;
	}	
	return false;		
}

function seBvaSearch() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Search", document.getElementById("bva_search").value);
	//myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/seBvaSearch', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {

		if(jsonResponse.length > 0 && jsonResponse.length < 6) {
			var newHtml = "";
			jsonResponse.forEach(function (value, i) {
				//console.log(i + " " + jsonResponse[i].company + jsonResponse[i]._id);
				newHtml += "<br /><div id=\"result\" class=\"searchResult\"><input name=\"seBvaSearch\" value=\"" + jsonResponse[i]._id + "\" type=\"radio\" class=\"radio\" id=\"" + jsonResponse[i]._id + "\"/><label for=\"" + jsonResponse[i]._id + "\" class=\"radio__label theme--dark\"><span class=\"radio__caption\"></span></label>" + jsonResponse[i].company + " <i>(" + jsonResponse[i]._id + ")</i></div>";
			});
			document.getElementById("results").innerHTML = newHtml;

			var results = new RegExp('(edit_se)').exec(window.location.href);

			if(results != null) {
				$(".radio").click(function() {
					document.getElementById("bva_id").value = this.id;
					console.log("worked");
						//userSearch();
				});
			}
		}
		if(jsonResponse.length == 0 || jsonResponse.status != undefined) {
				$('#no_result').css("display", "block");
		}
		if(jsonResponse.length > 5) {
				$('#many_result').css("display", "block");
		}
	})
}


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

function processDecimals(prePercent) {
	if(prePercent != '' && prePercent != undefined) {prePercent = getNumbersAndDots(prePercent); temp = prePercent; prePercent = ''; prePercent = temp; return prePercent;} else {prePercent = ''; return prePercent;}
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

function setSeEditLocation() {
	id = getGet('se_id');
	document.getElementById("edit").action="/editSeBva?se_id=" + id;
}

function setShareLocation() {
	id = getGet('bva_id');
	document.getElementById("share").action="/sharebva?bva_id=" + id;
}

function setSeShareLocation() {
	id = getGet('se_id');
	document.getElementById("share").action="/shareSeBva?se_id=" + id;
}


function enableUserSearch() {
	$(" #user_search ").click(function() {
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

// function setBvaLinks() {
// 	id = document.getElementById("bva_select").value;
// 	shareHref = "/share?bva_id=" + id;
// 	editHref = "/edit?bva_id=" + id;
// 	document.getElementById("edit").href=editHref;
// 	document.getElementById("share").href=shareHref;
// }

// function setSeLinks() {
// 	id = document.getElementById("se_id").value;
// 	shareHref = "/share_se?se_id=" + id;
// 	editHref = "/edit_se?se_id=" + id;
// 	//document.getElementById("se_continue").action="/workflow_se?se_id=" + id + "#outcomes";
// 	document.getElementById("edit").href=editHref;
// 	document.getElementById("share").href=shareHref;
// }

// function setFilters() {
// 	newId = document.getElementById("filters").value;
// 	document.getElementsByClassName("show-me")[0].style.display="none";
// 	document.getElementsByClassName("show-me")[0].classList.remove("show-me");
// 	document.getElementById(newId).classList.add("show-me");
// 	document.getElementById(newId).style.display="block";
// }

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
		document.getElementById("currency").value=jsonResponse.currency;
	})
}

function getSeAssessmentForEdit() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	se_id = getGet('se_id');

	myHeaders.append("se_id", se_id);

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/getSeAssessmentMetaData', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
		document.getElementById("company").value=jsonResponse.company;

		var bvaHeaders = new Headers();
		bvaHeaders.append("Content-Type", "application/json");
		bvaHeaders.append("Accept", "application/json");
		bvaHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

		bva_id = jsonResponse.bva_id;

		bvaHeaders.append("bva_id", bva_id);

		var myInit = { method: 'GET',
			headers: bvaHeaders,
			cache: 'default',
			credentials: 'same-origin'
		}

		fetch('/getAssessmentMetaData', myInit)

		.then(function(response) {
			return response.json();
		})

		.then(function(jsonResponse) {
			document.getElementById("bva_search").value=jsonResponse.company;
			document.getElementById("bva_id").value=jsonResponse._id;
		})
	})
}

function addToMine(id) {

	company = document.getElementById(id).parentElement.parentElement.getElementsByTagName("td")[0].innerHTML;

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
			console.log("removing event listener");
			document.getElementById(id).removeEventListener("click", getIt);
			document.getElementById(id).disabled=true;
		}
		if(jsonResponse.status == "fail") {
			scrollToTop();
			$(".share-failure").css("display", "block");
		}
	})
}

function getIt() {
	addToMine(this.id);
}

function userSearch() {


	for(i=0;i<document.getElementById("opp_results").tBodies.length;i++) {
		document.getElementById("opp_results").tBodies[i].style.display="none";
		document.getElementById("opp_results").tBodies[i].children[0].children[0].innerHTML="";
		document.getElementById("opp_results").tBodies[i].children[0].children[1].innerHTML="";
		document.getElementById("opp_results").tBodies[i].children[0].children[2].innerHTML="";
	}


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

	Promise.all([
		fetch("/searchUsers", myInit).then(value => value.json()),
		fetch("/searchSEYou", myInit).then(value => value.json())
		]).then((value) => {
		
		var personResults = value[0];
		var youResults = value[1];

			console.log(personResults);

		if(personResults.status != "failed") {
	
			$('#search_results').css("display", "block");
			$('#no_search_results').css("display", "none");

			for(i=0;i<document.getElementById("opp_results").tBodies.length;i++) {

				if(personResults[i] != undefined) {
					document.getElementById("opp_results").tBodies[i].style.display="table-row-group";

	
					document.getElementById("opp_results").tBodies[i].children[0].children[0].innerHTML="" + personResults[i].company + "";
					document.getElementById("opp_results").tBodies[i].children[0].children[1].innerHTML="" + personResults[i].currency + "";

					var added = 0;

					for(x=0; x<youResults.length;x++) {
						if(youResults[x]._id == personResults[i]._id) {
							var added = "disabled";
						}
					}

					document.getElementById("opp_results").tBodies[i].children[0].children[2].innerHTML='<button ' + added + ' type="button" style="width: 25px; height: 25px" class="btn btn--primary theme--dark add-button" id="' + personResults[i]._id + '"><img src="/static/add-white.png" height="20px" width="20px"></button>';

					if(added == 0) {
						console.log("adding event listener");
						document.getElementById(personResults[i]._id).addEventListener("click", getIt);
					}
				}	
			}
	
		
	
			}
			else {
				$('#search_results').css("display", "none");
				$('#no_search_results').css("display", "block");
				var results = 0;
			}














	}).catch((err) => {
			console.log(err);
	});



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

		if(jsonObj[0]._id == "new") {
			document.getElementById("results").innerHTML = 'Please create an assessment to get started!';
			//dtrum.identifyUser(jsonObj[0].username);
		}

		else {
			for(i=0;i<jsonObj.length;i++) {
				newHTML += '<p><h1>' + jsonObj[i].company + '</h1><a href="/workflow?bva_id=' + jsonObj[i].id + '#biz"><u>View</u></a> | <a href="/edit?bva_id=' + jsonObj[i].id + '"><u>Edit</u></a> | <a href="/share?bva_id=' + jsonObj[i].id + '"><u>Share</u></a></p>';
			}
			//dtrum.identifyUser(jsonObj[0].username);
			document.getElementById("results").innerHTML = newHTML;
			//setBvaLinks();
		}
	})
}

function getSEAssessmentList() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/getSEAssessmentList', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonObj) {
		var newHTML = '';

		if(jsonObj[0]._id == "new") {
			document.getElementById("se_id").innerHTML = '<option value="">Create an assessment!</option>';
			//dtrum.identifyUser(jsonObj[0].username);
		}

		else {
			for(i=0;i<jsonObj.length;i++) {
				newHTML += '<p><h1>' + jsonObj[i].company + '</h1><a href="/workflow_se?se_id=' + jsonObj[i].id + '#technical"><u>View</u></a> | <a href="/edit_se?se_id=' + jsonObj[i].id + '"><u>Edit</u></a> | <a href="/share_se?se_id=' + jsonObj[i].id + '"><u>Share</u></a></p>';
			}
			//dtrum.identifyUser(jsonObj[0].username);
			document.getElementById("results_tracker").innerHTML = newHTML;
			//setSeLinks();
		}
	})
}

function getAssessmentData(read) {
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

		if(read == 1) {

		}
		else {
			$(" .delete ").click(function() {

				deleteExistingTool(this.id);
	
			});
		}


		drawResults();
	})
}

function radioInput(name, id) {
	if(name == null) {
		
	}
	else {
		document.getElementsByName(name)[id].checked = true;
	}
}

function checkInput(name, value) {
	if(value == true) {
		document.getElementById(name).checked = true;
	}
}

function getSeAssessmentData() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	bva_id = getGet('se_id');

	myHeaders.append("se_id", se_id);

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/getSeAssessmentData', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
		
		radioInput("trends", jsonResponse.trends);
		document.getElementById("trends_prio").value = jsonResponse.trends_prio;
		radioInput("causation", jsonResponse.causation);
		document.getElementById("causation_prio").value = jsonResponse.causation_prio;
		document.getElementById("outcomes_appowner_feedback").value = jsonResponse.outcomes_appowner_feedback;
		radioInput("digital", jsonResponse.digital);
		document.getElementById("digital_prio").value = jsonResponse.digital_prio;
		radioInput("bi", jsonResponse.bi);
		document.getElementById("bi_prio").value = jsonResponse.bi_prio;
		radioInput("market", jsonResponse.market);
		document.getElementById("market_prio").value = jsonResponse.market_prio;
		document.getElementById("outcomes_cxo_feedback").value = jsonResponse.outcomes_cxo_feedback;
		radioInput("driving", jsonResponse.driving);
		document.getElementById("driving_prio").value = jsonResponse.driving_prio;
		radioInput("healing", jsonResponse.healing);
		document.getElementById("healing_prio").value = jsonResponse.healing_prio;
		radioInput("culture", jsonResponse.culture);
		document.getElementById("culture_prio").value = jsonResponse.culture_prio;
		radioInput("automation", jsonResponse.automation);
		document.getElementById("automation_prio").value = jsonResponse.automation_prio;
		radioInput("bill", jsonResponse.bill);
		document.getElementById("bill_prio").value = jsonResponse.bill_prio;
		document.getElementById("autonomous_appowner_feedback").value = jsonResponse.autonomous_appowner_feedback;
		radioInput("tool_cons", jsonResponse.tool_cons);
		document.getElementById("tool_cons_prio").value = jsonResponse.tool_cons_prio;
		radioInput("devops", jsonResponse.devops);
		document.getElementById("devops_prio").value = jsonResponse.devops_prio;
		radioInput("ai", jsonResponse.ai);
		document.getElementById("ai_prio").value = jsonResponse.ai_prio;
		radioInput("integrations", jsonResponse.integrations);
		document.getElementById("integrations_prio").value = jsonResponse.integrations_prio;
		document.getElementById("fullstack_ops_feedback").value = jsonResponse.fullstack_ops_feedback;
		radioInput("release", jsonResponse.release);
		document.getElementById("release_prio").value = jsonResponse.release_prio;
		radioInput("lifecycle", jsonResponse.lifecycle);
		document.getElementById("lifecycle_prio").value = jsonResponse.lifecycle_prio;
		radioInput("shift", jsonResponse.shift);
		document.getElementById("shift_prio").value = jsonResponse.shift_prio;
		document.getElementById("fullstack_dev_feedback").value = jsonResponse.fullstack_dev_feedback;
		radioInput("perfect", jsonResponse.perfect);
		document.getElementById("perfect_prio").value = jsonResponse.perfect_prio;
		radioInput("migration", jsonResponse.migration);
		document.getElementById("migration_prio").value = jsonResponse.migration_prio;
		radioInput("transaction", jsonResponse.transaction);
		document.getElementById("transaction_prio").value = jsonResponse.transaction_prio;
		document.getElementById("fullstack_appowner_feedback").value = jsonResponse.fullstack_appowner_feedback;
		document.getElementById("outcomes_appowner_value").value = jsonResponse.outcomes_appowner_value;
		document.getElementById("outcomes_cxo_value").value = jsonResponse.outcomes_cxo_value;
		document.getElementById("autonomous_appowner_value").value = jsonResponse.autonomous_appowner_value;
		document.getElementById("fullstack_ops_value").value = jsonResponse.fullstack_ops_value;
		document.getElementById("fullstack_dev_value").value = jsonResponse.fullstack_dev_value;
		document.getElementById("fullstack_appowner_value").value = jsonResponse.fullstack_appowner_value;
		document.getElementById("lead_sales").value = jsonResponse.lead_sales;
		document.getElementById("lead_se").value = jsonResponse.lead_se;
		document.getElementById("business_champion").value = jsonResponse.business_champion;
		document.getElementById("technical_champion").value = jsonResponse.technical_champion;
		checkInput("saas", jsonResponse.saas);
		checkInput("managed", jsonResponse.managed);
		checkInput("offline", jsonResponse.offline);
		document.getElementById("tenant").value = jsonResponse.tenant;
		checkInput("windows", jsonResponse.windows);
		checkInput("linux", jsonResponse.linux);
		checkInput("aix", jsonResponse.aix);
		checkInput("solaris", jsonResponse.solaris);
		checkInput("vmware", jsonResponse.vmware);
		checkInput("azure", jsonResponse.azure);
		checkInput("aws", jsonResponse.aws);
		checkInput("openshift", jsonResponse.openshift);
		checkInput("cloudfoundry", jsonResponse.cloudfoundry);
		checkInput("ibmcloud", jsonResponse.ibmcloud);
		checkInput("oraclecloud", jsonResponse.oraclecloud);
		checkInput("gcp", jsonResponse.gcp);
		checkInput("heroku", jsonResponse.heroku);
		checkInput("openstack", jsonResponse.openstack);
		checkInput("kubernetes", jsonResponse.kubernetes);
		checkInput("iaas", jsonResponse.iaas);
		checkInput("paas", jsonResponse.paas);
		checkInput("softaas", jsonResponse.softaas);
		checkInput("faas", jsonResponse.faas);		
		checkInput("java", jsonResponse.java);
		checkInput("dotnet", jsonResponse.dotnet);
		checkInput("php", jsonResponse.php);
		checkInput("nodejs", jsonResponse.nodejs);	
		checkInput("messaging", jsonResponse.messaging);
		checkInput("c", jsonResponse.c);
		checkInput("dotnetcore", jsonResponse.dotnetcore);
		checkInput("webserver", jsonResponse.webserver);
		checkInput("golang", jsonResponse.golang);
		checkInput("mainframe", jsonResponse.mainframe);	
		checkInput("web", jsonResponse.web);
		checkInput("mobileapp", jsonResponse.mobileapp);
		checkInput("thick", jsonResponse.thick);
		checkInput("citrix", jsonResponse.citrix);		
		checkInput("browser", jsonResponse.browser);
		checkInput("http", jsonResponse.http);	
		checkInput("external", jsonResponse.external);
		checkInput("oaplugins", jsonResponse.oaplugins);
		checkInput("cnd", jsonResponse.cnd);
		checkInput("agplugins", jsonResponse.agplugins);
		checkInput("externalevents", jsonResponse.externalevents);
		checkInput("incidents", jsonResponse.incidents);
		checkInput("cmdb", jsonResponse.cmdb);	
		checkInput("api", jsonResponse.api);	
		checkInput("iot", jsonResponse.iot);
		checkInput("iib", jsonResponse.iib);
		checkInput("python", jsonResponse.python);
		checkInput("docker", jsonResponse.docker);
		checkInput("cloud", jsonResponse.cloud);
		checkInput("onprem", jsonResponse.onprem);
		checkInput("hybrid", jsonResponse.hybrid);			
		drawSeResults();
	})
}

function updateAssessment() {
	var assessment_data = {
		company_revenue: getNumbersAndDots(document.getElementById("company_revenue").value),
		projected_growth: getNumbersAndDots(document.getElementById("projected_growth").value),
		revenue_dependent: getNumbersAndDots(document.getElementById("revenue_dependent").value),
		app_uptime: getNumbersAndDots(document.getElementById("app_uptime").value),
		revenue_breach: getNumbersAndDots(document.getElementById("revenue_breach").value),
		incidents_month: getNumbers(document.getElementById("incidents_month").value),
		no_ops_troubleshoot: getNumbers(document.getElementById("no_ops_troubleshoot").value),
		no_dev_troubleshoot: getNumbers(document.getElementById("no_dev_troubleshoot").value),
		mttr: getNumbers(document.getElementById("mttr").value),
		no_apps_e2e: getNumbers(document.getElementById("no_apps_e2e").value),
		no_t1t2_apps: getNumbers(document.getElementById("no_t1t2_apps").value),
		no_fte_existing: getNumbersAndDots(document.getElementById("no_fte_existing").value),
		existing_apps: [],
		cycles_per_year: getNumbers(document.getElementById("cycles_per_year").value),
		cycle_days: getNumbers(document.getElementById("cycle_days").value),
		test_per_cycle: getNumbersAndDots(document.getElementById("test_per_cycle").value),
		qa_time_per_cycle: getNumbersAndDots(document.getElementById("qa_time_per_cycle").value),
		qa_people_per_cycle: getNumbersAndDots(document.getElementById("qa_people_per_cycle").value),
		dev_time_per_cycle: getNumbersAndDots(document.getElementById("dev_time_per_cycle").value),
		dev_people_per_cycle: getNumbersAndDots(document.getElementById("dev_people_per_cycle").value),
		operation_cost: getNumbersAndDots(document.getElementById("operation_cost").value),
		developer_cost: getNumbersAndDots(document.getElementById("developer_cost").value),
		qa_cost: getNumbersAndDots(document.getElementById("qa_cost").value),
		work_hours: getNumbers(document.getElementById("work_hours").value),
		benefit_conversion: getNumbersAndDots(document.getElementById("benefit_conversion").value),
		benefit_incident_reduction: getNumbersAndDots(document.getElementById("benefit_incident_reduction").value),
		benefit_mttr: getNumbersAndDots(document.getElementById("benefit_mttr").value),
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

function getRadioValue(name) {
	var radios = document.getElementsByName(name);
	for (i=0 ; i < radios.length ; i++) {
		if(radios[i].checked == true) {
			return i;
		}
	}
}

function updateSeAssessment() {
	var assessment_data = {
		trends: getRadioValue("trends"),
		trends_prio: document.getElementById("trends_prio").value,
		causation: getRadioValue("causation"),
		causation_prio: document.getElementById("causation_prio").value,
		outcomes_appowner_feedback: document.getElementById("outcomes_appowner_feedback").value,
		outcomes_appowner_value: document.getElementById("outcomes_appowner_value").value,
		digital: getRadioValue("digital"),
		digital_prio: document.getElementById("digital_prio").value,
		bi: getRadioValue("bi"),
		bi_prio: document.getElementById("bi_prio").value,
		market: getRadioValue("market"),
		market_prio: document.getElementById("market_prio").value,
		outcomes_cxo_feedback: document.getElementById("outcomes_cxo_feedback").value,
		outcomes_cxo_value: document.getElementById("outcomes_cxo_value").value,
		driving: getRadioValue("driving"),
		driving_prio: document.getElementById("driving_prio").value,
		healing: getRadioValue("healing"),
		healing_prio: document.getElementById("healing_prio").value,
		culture: getRadioValue("culture"),
		culture_prio: document.getElementById("culture_prio").value,
		automation: getRadioValue("automation"),
		automation_prio: document.getElementById("automation_prio").value,
		bill: getRadioValue("bill"),
		bill_prio: document.getElementById("bill_prio").value,
		autonomous_appowner_feedback: document.getElementById("autonomous_appowner_feedback").value,
		autonomous_appowner_value: document.getElementById("autonomous_appowner_value").value,
		tool_cons: getRadioValue("tool_cons"),
		tool_cons_prio: document.getElementById("tool_cons_prio").value,
		devops: getRadioValue("devops"),
		devops_prio: document.getElementById("devops_prio").value,
		ai: getRadioValue("ai"),
		ai_prio: document.getElementById("ai_prio").value,
		integrations: getRadioValue("integrations"),
		integrations_prio: document.getElementById("integrations_prio").value,
		fullstack_ops_feedback: document.getElementById("fullstack_ops_feedback").value,
		fullstack_ops_value: document.getElementById("fullstack_ops_value").value,
		release: getRadioValue("release"),
		release_prio: document.getElementById("release_prio").value,
		lifecycle: getRadioValue("lifecycle"),
		lifecycle_prio: document.getElementById("lifecycle_prio").value,
		shift: getRadioValue("shift"),
		shift_prio: document.getElementById("shift_prio").value,
		fullstack_dev_feedback: document.getElementById("fullstack_dev_feedback").value,
		fullstack_dev_value: document.getElementById("fullstack_dev_value").value,
		perfect: getRadioValue("perfect"),
		perfect_prio: document.getElementById("perfect_prio").value,
		migration: getRadioValue("migration"),
		migration_prio: document.getElementById("migration_prio").value,
		transaction: getRadioValue("transaction"),
		transaction_prio: document.getElementById("transaction_prio").value,
		fullstack_appowner_feedback: document.getElementById("fullstack_appowner_feedback").value,
		fullstack_appowner_value: document.getElementById("fullstack_appowner_value").value,
		lead_sales: document.getElementById("lead_sales").value,
		lead_se: document.getElementById("lead_se").value,
		business_champion: document.getElementById("business_champion").value,
		technical_champion: document.getElementById("technical_champion").value,
		saas: document.getElementById("saas").checked,
		managed: document.getElementById("managed").checked,
		offline: document.getElementById("offline").checked,
		tenant: document.getElementById("tenant").value,
		windows: document.getElementById("windows").checked,
		linux: document.getElementById("linux").checked,
		aix: document.getElementById("aix").checked,
		solaris: document.getElementById("solaris").checked,
		vmware: document.getElementById("vmware").checked,
		azure: document.getElementById("azure").checked,
		aws: document.getElementById("aws").checked,
		openshift: document.getElementById("openshift").checked,
		cloudfoundry: document.getElementById("cloudfoundry").checked,
		ibmcloud: document.getElementById("ibmcloud").checked,
		oraclecloud: document.getElementById("oraclecloud").checked,
		gcp: document.getElementById("gcp").checked,
		heroku: document.getElementById("heroku").checked,
		openstack: document.getElementById("openstack").checked,
		kubernetes: document.getElementById("kubernetes").checked,
		iaas: document.getElementById("iaas").checked,
		paas: document.getElementById("paas").checked,
		faas: document.getElementById("faas").checked,
		softaas: document.getElementById("softaas").checked,
		java: document.getElementById("java").checked,
		dotnet: document.getElementById("dotnet").checked,
		php: document.getElementById("php").checked,
		nodejs: document.getElementById("nodejs").checked,
		messaging: document.getElementById("messaging").checked,
		c: document.getElementById("c").checked,
		dotnetcore: document.getElementById("dotnetcore").checked,
		webserver: document.getElementById("webserver").checked,
		golang: document.getElementById("golang").checked,
		mainframe: document.getElementById("mainframe").checked,
		web: document.getElementById("web").checked,
		mobileapp: document.getElementById("mobileapp").checked,
		thick: document.getElementById("thick").checked,
		citrix: document.getElementById("citrix").checked,
		browser: document.getElementById("browser").checked,
		http: document.getElementById("http").checked,
		external: document.getElementById("external").checked,
		oaplugins: document.getElementById("oaplugins").checked,
		cnd: document.getElementById("cnd").checked,
		agplugins: document.getElementById("agplugins").checked,
		externalevents: document.getElementById("externalevents").checked,
		incidents: document.getElementById("incidents").checked,
		cmdb: document.getElementById("cmdb").checked,
		api: document.getElementById("api").checked,
		iot: document.getElementById("iot").checked,
		iib: document.getElementById("iib").checked,
		python: document.getElementById("python").checked,
		docker: document.getElementById("docker").checked,
		cloud: document.getElementById("cloud").checked,
		onprem: document.getElementById("onprem").checked,
		hybrid: document.getElementById("hybrid").checked		
	}

	console.log(assessment_data);
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	se_id = getGet('se_id');

	myHeaders.append("se_id", se_id);

	var myInit = { method: 'POST',
	 headers: myHeaders,
	 cache: 'default',
	 credentials: 'same-origin',
	 body: JSON.stringify(assessment_data)
	}

	fetch('/updateSeAssessment', myInit)

	.then(function(response) {

	})
}

function addListeners() {

	getTabs();

	$(".leftContainer").css("height", $('.biz').css('height'));

		function goToAnchor(anchor) {
		  var loc = document.location.toString().split('#')[0];
		  document.location = loc + '#' + anchor;
		  return false;
		}

	$("#existingToolAdd").click(function() {
		addExistingTool();
	});

	$(" .opsFromBiz ").click(function() {
		goToAnchor("ops");
		getAssessmentData(0);
	});

	$(" .bizFromOps ").click(function() {
		goToAnchor("biz");
		getAssessmentData(0);
	});

	$(" .devFromOps ").click(function() {
		goToAnchor("dev");
		getAssessmentData(0);
	});

	$(" .opsFromDev ").click(function() {
		goToAnchor("ops");
		getAssessmentData(0);
	});

	$(" .optionsFromDev ").click(function() {
		goToAnchor("options");
		getAssessmentData(0);
	});

	$(" .devFromOptions ").click(function() {
		goToAnchor("dev");
		getAssessmentData(0);
	});

	showContent();

	$('#company_revenue, #operation_cost, #developer_cost, #qa_cost, #annual_cost, #y1_software, #y1_services, #y2_software, #y2_services, #y3_software, #y3_services').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = document.getElementById("currency").value + parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		updateAssessment();
		drawResults();
	} );

	$('#projected_growth, #revenue_breach, #revenue_dependent, #app_uptime, #test_per_cycle, #qa_time_per_cycle, #dev_time_per_cycle, #benefit_conversion, #benefit_incident_reduction, #benefit_mttr, #benefit_sla, #benefit_fix_qa, #benefit_prod_reduction, #benefit_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		updateAssessment();
		drawResults();
	} );

	$('#incidents_month, #no_ops_troubleshoot, #no_dev_troubleshoot, #mttr, #no_apps_e2e, #no_t1t2_apps, #no_fte_existing, #cycles_per_year, #cycle_days, #qa_people_per_cycle, #dev_people_per_cycle, #work_hours').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = parseInt(getNumbersAndDots(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		updateAssessment();
		drawResults();
	});

	$('#no_fte_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		updateAssessment();
		drawResults();
	});	
	
	$("#open-report").click(function() {
		openReport();
	});
}

function addReadOnlyListeners() {

	getTabs();

	$(".leftContainer").css("height", $('.biz').css('height'));

		function goToAnchor(anchor) {
		  var loc = document.location.toString().split('#')[0];
		  document.location = loc + '#' + anchor;
		  return false;
		}

	$(" .opsFromBiz ").click(function() {
		goToAnchor("ops");
		getAssessmentData(1);
	});

	$(" .bizFromOps ").click(function() {
		goToAnchor("biz");
		getAssessmentData(1);
	});

	$(" .devFromOps ").click(function() {
		goToAnchor("dev");
		getAssessmentData(1);
	});

	$(" .opsFromDev ").click(function() {
		goToAnchor("ops");
		getAssessmentData(1);
	});

	$(" .optionsFromDev ").click(function() {
		goToAnchor("options");
		getAssessmentData(1);
	});

	$(" .devFromOptions ").click(function() {
		goToAnchor("dev");
		getAssessmentData(1);
	});

	showContent();

	$('#company_revenue, #operation_cost, #developer_cost, #qa_cost, #annual_cost, #y1_software, #y1_services, #y2_software, #y2_services, #y3_software, #y3_services').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = document.getElementById("currency").value + parseInt(getNumbers(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		drawResults();
	} );

	$('#projected_growth, #revenue_breach, #revenue_dependent, #app_uptime, #test_per_cycle, #qa_time_per_cycle, #dev_time_per_cycle, #benefit_conversion, #benefit_incident_reduction, #benefit_mttr, #benefit_sla, #benefit_fix_qa, #benefit_prod_reduction, #benefit_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		drawResults();
	} );

	$('#incidents_month, #no_ops_troubleshoot, #no_dev_troubleshoot, #mttr, #no_apps_e2e, #no_t1t2_apps, #no_fte_existing, #cycles_per_year, #cycle_days, #qa_people_per_cycle, #dev_people_per_cycle, #work_hours').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = parseInt(getNumbersAndDots(this.value)).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		drawResults();
	});

	$('#no_fte_config').on( "blur", function() {
		if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value).toLocaleString(); temp = this.value; this.value = ''; this.value = temp; } else {this.value = '';}
		drawResults();
	});	
	
	$("#open-report").click(function() {
		openReport();
	});
}

function addSeListeners() {

	getSeTabs();

	//$(".leftContainer").css("height", $('.biz').css('height'));
	
	//$(".leftContainer").css("height", $('.options').css('height'));

		function goToAnchor(anchor) {
		  var loc = document.location.toString().split('#')[0];
		  document.location = loc + '#' + anchor;
		  return false;
		}

	$(" .autonomousFromOutcomes ").click(function() {
		goToAnchor("autonomous");
		getSeAssessmentData();
	});

	$(" .outcomesFromAutonomous ").click(function() {
		goToAnchor("outcomes");
		getSeAssessmentData();
	});

	$(" .enterpriseFromAutonomous ").click(function() {
		goToAnchor("enterprise");
		getSeAssessmentData();
	});

	$(" .autonmousFromEnterprise ").click(function() {
		goToAnchor("autonomous");
		getSeAssessmentData();
	});

	$(" .technicalFromEnterprise ").click(function() {
		goToAnchor("technical");
		getSeAssessmentData();
	});

	$(" .enterpriseFromTechnical ").click(function() {
		goToAnchor("enterprise");
		getSeAssessmentData();
	});

	showSeContent();

	$('.radio').click(function() {
		//this.parentElement.getElementsByTagName("input")[0].checked == true;
		updateSeAssessment();
		drawSeResults();
	} );

	$('#autonomous_appowner_feedback, #fullstack_appowner_feedback, #fullstack_dev_feedback, #fullstack_ops_feedback, #outcomes_appowner_feedback, #outcomes_cxo_feedback, #lead_sales, #lead_se, #business_champion, #technical_champion, #tenant').on( "blur", function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 updateSeAssessment();
		 drawSeResults();
	} );
	
	$('.checkbox').click(function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 updateSeAssessment();
		 drawSeResults();
	} );	
	
	$(".select").change(function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 updateSeAssessment();
		 drawSeResults();
	} );		

}

function addSeReadOnlyListeners() {

	getSeTabs();

	//$(".leftContainer").css("height", $('.biz').css('height'));
	
	//$(".leftContainer").css("height", $('.options').css('height'));

		function goToAnchor(anchor) {
		  var loc = document.location.toString().split('#')[0];
		  document.location = loc + '#' + anchor;
		  return false;
		}

	$(" .autonomousFromOutcomes ").click(function() {
		goToAnchor("autonomous");
		getSeAssessmentData();
	});

	$(" .outcomesFromAutonomous ").click(function() {
		goToAnchor("outcomes");
		getSeAssessmentData();
	});

	$(" .enterpriseFromAutonomous ").click(function() {
		goToAnchor("enterprise");
		getSeAssessmentData();
	});

	$(" .autonmousFromEnterprise ").click(function() {
		goToAnchor("autonomous");
		getSeAssessmentData();
	});

	$(" .technicalFromEnterprise ").click(function() {
		goToAnchor("technical");
		getSeAssessmentData();
	});

	$(" .enterpriseFromTechnical ").click(function() {
		goToAnchor("enterprise");
		getSeAssessmentData();
	});

	showSeContent();

	$('.radio').click(function() {
		//this.parentElement.getElementsByTagName("input")[0].checked == true;
		drawSeResults();
	} );

	$('#autonomous_appowner_feedback, #fullstack_appowner_feedback, #fullstack_dev_feedback, #fullstack_ops_feedback, #outcomes_appowner_feedback, #outcomes_cxo_feedback, #lead_sales, #lead_se, #business_champion, #technical_champion, #tenant').on( "blur", function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 drawSeResults();
	} );
	
	$('.checkbox').click(function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 drawSeResults();
	} );	
	
	$(".select").change(function() {
		// if(this.value != '' && this.value != undefined) {this.value = getNumbersAndDots(this.value) + '%'; temp = this.value; this.value = ''; this.value = temp; } else { this.value = '';}
		 drawSeResults();
	} );		

}

function showContent() {

		if ($(location).attr('hash').substr(1) == "biz") {
				$(".biz, .result-biz").fadeIn();
				$(".ops, .result-ops, .dev, .result-dev, .options, .result-options").fadeOut();
				$(".leftContainer").css("height", $('.biz').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "ops") {
			$(".ops, .result-ops").fadeIn();
			$(".biz, .result-biz, .dev, .result-dev, .options, .result-options").fadeOut();
			$(".leftContainer").css("height", $('.ops').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "dev") {
			$(".dev, .result-dev").fadeIn();
			$(".biz, .result-biz, .ops, .result-ops, .options, .result-options").fadeOut();
			$(".leftContainer").css("height", $('.dev').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "options") {
			$(".options, .result-options").fadeIn();
			$(".biz, .result-biz, .ops, .result-ops, .dev, .result-dev").fadeOut();
			$(".leftContainer").css("height", $('.options').css('height'));
		}

}

function showSeContent() {

		if ($(location).attr('hash').substr(1) == "outcomes") {
			$(".biz, .result-biz").fadeIn();
			$(".ops, .result-ops, .dev, .result-dev, .options, .result-options").fadeOut();
			$(".leftContainer").css("height", $('.biz').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "autonomous") {
			$(".ops, .result-ops").fadeIn();
			$(".biz, .result-biz, .dev, .result-dev, .options, .result-options").fadeOut();
			$(".leftContainer").css("height", $('.ops').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "enterprise") {
			$(".dev, .result-dev").fadeIn();
			$(".biz, .result-biz, .ops, .result-ops, .options, .result-options").fadeOut();
			$(".leftContainer").css("height", $('.dev').css('height'));
		}

		if ($(location).attr('hash').substr(1) == "technical") {
			$(".options, .result-options").fadeIn();
			$(".biz, .result-biz, .ops, .result-ops, .dev, .result-dev").fadeOut();
			$(".leftContainer").css("height", $('.options').css('height'));
		}

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
		if(jsonObj.currency == "uk") { var currency = "£" }
		if(jsonObj.currency == "ireland") { var currency = "€" }
		if(jsonObj.currency == "us") { var currency = "$" }
		if(jsonObj.currency == "spain") { var currency = "€" }
		if(jsonObj.currency == "benelux") { var currency = "€" }
		if(jsonObj.currency == "germany") { var currency = "€" }
		if(jsonObj.currency == "france") { var currency = "€" }
		if(jsonObj.currency == "italy") { var currency = "€" }

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

		if(document.getElementById("company_name")) {
			document.getElementById("company_name").innerHTML=jsonObj.company;
		}

		getSharedWith();

		getAssessmentData();

	})
}

function getSharedWith() {
	var bva_id = getGet('bva_id');
	// var username = new RegExp('(<\/span>)(.*)').exec(document.getElementsByClassName("user-email")[0].innerHTML);
	// var username = username[2];

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

	fetch('/getSharedWith', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
		var sharedWithUsers = "";

		for(i=0;i<jsonResponse.length;i++) {
			var check = new RegExp('(@dynatrace.com)').exec(jsonResponse[i].username);
			if(check == null) {
				if(sharedWithUsers == "") {
					sharedWithUsers += jsonResponse[i].username;
				}
				else {
					sharedWithUsers += ", " + jsonResponse[i].username;
				}
			}
			else {

			}
		}

		if(sharedWithUsers.length > 0) {
			document.getElementsByClassName("user-shared")[0].innerHTML = "<span class=\"tag__key\">shared with: </span>" + sharedWithUsers;
			document.getElementsByClassName("user-shared")[0].style.display="inline-block";
			document.getElementsByClassName("user-shared")[1].innerHTML = "<span class=\"tag__key\">shared with: </span>" + sharedWithUsers;
			document.getElementsByClassName("user-shared")[1].style.display="inline-block";
			document.getElementsByClassName("user-shared")[2].innerHTML = "<span class=\"tag__key\">shared with: </span>" + sharedWithUsers;
			document.getElementsByClassName("user-shared")[2].style.display="inline-block";
			document.getElementsByClassName("user-shared")[3].innerHTML = "<span class=\"tag__key\">shared with: </span>" + sharedWithUsers;
			document.getElementsByClassName("user-shared")[3].style.display="inline-block";
		}

		else {

		}
	})
}	

function getSeTabs() {
	se_id = getGet('se_id');

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	myHeaders.append("se_id", se_id);

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/getSeUserDetails', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonObj) {

		document.getElementsByClassName("user-email")[0].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[0].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[1].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[1].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[2].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[2].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;

		document.getElementsByClassName("user-email")[3].innerHTML = "<span class=\"tag__key\">email: </span>" + jsonObj.username;
		document.getElementsByClassName("user-company")[3].innerHTML = "<span class=\"tag__key\">company: </span>" + jsonObj.company;
	})
	
	getSeAssessmentData();
}

function addExistingTool() {

	var tool_id = generateId();

	var existingTool = {
		tool_id: tool_id,
		name_tool: document.getElementById("name_tool").value,
		annual_cost: getNumbers(document.getElementById("annual_cost").value),
		no_fte_config: getNumbersAndDots(document.getElementById("no_fte_config").value),
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

		var newApp = "<div class=\"bva-question-wrapper bva-question-top \" \"><div class=\"bva-question-existing-wrapper\">	<div style=\"position: relative\"> <h2 style=\"display: inline-block\">" + document.getElementById("name_tool").value + "</h2> <div style=\"display: inline-block; position: absolute; right: 0px\"><a class=\"delete\" id=\"" + tool_id + "\"><img src=\"/static/delete-grey.svg\"  width=\"40px\" height=\"40px\" /></a></div> </div><p>" + document.getElementById("annual_cost").value + " - " + document.getElementById("no_fte_config").value + " FTEs</p><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 1: " + document.getElementById("existing_y1").value + "%</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y1").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 2: " + document.getElementById("existing_y2").value + "%</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y2").value) + "\" max=\"100\" id=\"p0\"></progress></div><div class=\"theme--green\"><label class=\"label--progressbar\" for=\"p0\">Year 3: " + document.getElementById("existing_y3").value + "%</label><progress class=\"progressbar\" value=\"" + getNumbers(document.getElementById("existing_y3").value) + "\" max=\"100\" id=\"p0\"></progress></div>	</div></div><br />";

		$( "#existing_apps" ).append( newApp );
		$(".leftContainer").css("height", $('.ops').css('height'));

		$(" .delete ").click(function() {
			deleteExistingTool(this.id);
		});
		


		document.getElementById("name_tool").value = "";
		document.getElementById("annual_cost").value = "";
		document.getElementById("no_fte_config").value = "";
		document.getElementById("existing_y1").value = "100";
		document.getElementById("existing_y2").value = "100";
		document.getElementById("existing_y3").value = "100";

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

function addSeDeleteId() {
	id = getGet('se_id');
	document.getElementById("finalDelete").href="/deleteSeAssessment?se_id=" + id;
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

function drawSeResults() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Accept", "application/json");
	myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

	bva_id = getGet('se_id');

	myHeaders.append("se_id", se_id);

	var myInit = { method: 'GET',
		headers: myHeaders,
		cache: 'default',
		credentials: 'same-origin'
	}

	fetch('/getSeAssessmentData', myInit)

	.then(function(response) {
		return response.json();
	})

	.then(function(jsonResponse) {
			
			var outcomesTotal = jsonResponse.trends + jsonResponse.causation + jsonResponse.digital + jsonResponse.bi + jsonResponse.market;
			var outcomesProg = Math.ceil((outcomesTotal / 15) * 100);
			var outcomesValue = 1514 - (1514 / 100 * outcomesProg);
			document.getElementById("resultCircles").getElementsByClassName("divTableCell")[2].innerHTML="<div id=\"outcomesCircle\"  class=\"progresscircle progresscircle--bold theme--purple \" ><svg viewBox=\"0 0 512 512\" style=\"height:150px; width=150px\"><path class=\"progresscircle__background\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" /><path class=\"progresscircle__progress\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" style=\"stroke-dashoffset: " + outcomesValue + ";\"/></svg></div>";
			document.getElementById("resultPercent").getElementsByClassName("divTableCell")[2].innerHTML="<b class=\"se-big-text\">" + outcomesProg + "%</b> (" + outcomesTotal + "/15)<br /><i class=\"se-small-text\">Demonstrating the outcomes to business owners</i>";
			
			var autonomousTotal = jsonResponse.driving + jsonResponse.healing + jsonResponse.culture + jsonResponse.automation + jsonResponse.bill;
			var autonomousProg = Math.ceil((autonomousTotal / 15) * 100);
			var autonomousValue = 1514 - (1514 / 100 * autonomousProg);
			document.getElementById("resultCircles").getElementsByClassName("divTableCell")[1].innerHTML="<div id=\"autonomousCircle\"  class=\"progresscircle progresscircle--bold theme--green \" data-progress=" + autonomousValue + " ><svg viewBox=\"0 0 512 512\" style=\"height:150px; width=150px\"><path class=\"progresscircle__background\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" /><path class=\"progresscircle__progress\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" style=\"stroke-dashoffset: " + autonomousValue + ";\"/></svg></div>";
			document.getElementById("resultPercent").getElementsByClassName("divTableCell")[1].innerHTML="<b class=\"se-big-text\">" + autonomousProg + "%</b> (" + autonomousTotal + "/15)<br /><i class=\"se-small-text\">The journey towards the autonomous cloud</i>";
			
			var fullStackTotal = jsonResponse.tool_cons + jsonResponse.devops + jsonResponse.ai + jsonResponse.integrations + jsonResponse.release + jsonResponse.lifecycle + jsonResponse.shift + jsonResponse.perfect + jsonResponse.migration + jsonResponse.transaction;
			var fullStackProg = Math.ceil((fullStackTotal / 30) * 100);
			var fullStackValue = 1514 - (1514 / 100 * fullStackProg);
			document.getElementById("resultCircles").getElementsByClassName("divTableCell")[0].innerHTML="<div id=\"fullStackCircle\" class=\"progresscircle progresscircle--bold theme--blue \" data-progress=" + fullStackValue + " ><svg viewBox=\"0 0 512 512\" style=\"height:150px; width=150px\"><path class=\"progresscircle__background\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" /><path class=\"progresscircle__progress\" d=\"M256 15 a241 241 0 1 1 0 482 a241 241 0 1 1 0 -482z\" style=\"stroke-dashoffset: " + fullStackValue + ";\"/></svg></div>";
			document.getElementById("resultPercent").getElementsByClassName("divTableCell")[0].innerHTML="<b class=\"se-big-text\">" + fullStackProg + "%</b> (" + fullStackTotal + "/30)<br /><i class=\"se-small-text\">Full-stack monitoring of the new enterprise cloud</i>";
			
			
			var bizPrios = ["trends", "causation", "digital", "bi", "market"];
			var autoPrios = ["driving", "healing", "culture", "automation", "bill"];
			var fullstackPrios = ["tool_cons", "devops", "ai", "integrations", "release", "lifecycle", "shift", "perfect", "migration", "transaction"];
			
			var bizArray = [];
			
			//BIZNISS
			var totalOrder = [];
			
			//Loop through the priorities
			var highOrder = {};
			var highCount = 0;
			for(i=0; i<bizPrios.length; i++) {
				var temp = eval("jsonResponse." + bizPrios[i] + "_prio");
				
				//If it's high and not POC, add it to the array
				if(temp == "high" && eval("jsonResponse." + bizPrios[i]) < 3) {
					highOrder[bizPrios[i]] = eval("jsonResponse." + bizPrios[i]);
					highCount++;
				}	
			}

			//Add the high ones to the total
			for (i=0; i<highCount; i++) {
				if(i < 3) {
					totalOrder.push(sortMe(highOrder)[i][0]);
				}	
			}


			//If not enough high priority, carry on to medium
			if(highCount < 3) {
				var mediumOrder = {};	
				var mediumCount = 0;
				for(i=0; i<bizPrios.length; i++) {
					var temp = eval("jsonResponse." + bizPrios[i] + "_prio");
					
					//If it's medium and not POC, add it to the array
					if(temp == "medium" && eval("jsonResponse." + bizPrios[i]) < 3) {
						mediumOrder[bizPrios[i]] = eval("jsonResponse." + bizPrios[i]);
						mediumCount++;
					}			
				}	
			}

			//For the remaining gaps, add medium ones as far as possible
			for (i=0; i<3-highCount; i++) {
				if(sortMe(mediumOrder)[i] != undefined && i < 3-highCount) {
					totalOrder.push(sortMe(mediumOrder)[i][0]);
				}	
			}		
	
			//If not enough medium, carry on to low
			
			if(totalOrder.length < 3) {	
				var lowOrder = {};
				var lowCount = 0;
				for(i=0; i<bizPrios.length; i++) {
					var temp = eval("jsonResponse." + bizPrios[i] + "_prio");
					
					//If it's low and not POC, add it to the array
					if(temp == "low" && eval("jsonResponse." + bizPrios[i]) < 3) {
						lowOrder[bizPrios[i]] = eval("jsonResponse." + bizPrios[i]);
						lowCount++;
					}					
				}				
			}		

			//For the remaining gaps, add low ones as far as possible
			var remaining = 3 - totalOrder.length;
			for (i=0; i<remaining; i++) {
				if(sortMe(lowOrder)[i] != undefined && i<remaining) {
					totalOrder.push(sortMe(lowOrder)[i][0]);
				}	
			}				
			
			if(totalOrder.length == 0) {
				console.log("nothing");
			}
			else {
				var convos = ["trends","causation","digital","bi","market","driving","healing","culture","automation","bill","tool_cons","devops","ai","integration","release","lifecycle","shift","perfect","migration","transaction"];
				var convo_desc = ["Improvement trends due to tuning and transaction monitoring","Correlation vs. causation","Digital experience insights","Integrate with BI solutions","Market insights via DT One","Self-driving IT","Self-healing","Culture change","Automation","Managing your cloud bill","Tool consolidation","Scaling for DevOps","AI-driven actions","Integrations and automation","How to release software faster","Integrate across application lifecycle","DevOps- shifting left","Delivering the perfect software experience","Cloud migration","Business transaction monitoring"];
				var convo_team = ["Application Owners","Application Owners","CxO","CxO","CxO","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","Operations team","Operations team","Operations team","Operations team","Development team","Development team","Development team","Application owner","Application owner","Application owner"];
				var convo_stage = ["not started","Conversation","Demonstration","POC"];
				var convo_pic = ["info","discuss","demo","trial"];
				
				var bizResults = "";
				for(i=0;i<totalOrder.length;i++) {
					for(x=0;x<convos.length;x++) {
						if(totalOrder[i] == convos[x]) {
							//console.log("matching " + totalOrder[i] + " with " + convos[x] + " and priority " + eval("jsonResponse." + totalOrder[i]));
							var tempDesc = convo_desc[x];
							var tempTeam = convo_team[x];
							var tempStage = convo_stage[eval("jsonResponse." + totalOrder[i]) + 1];
							var tempPic = convo_pic[eval("jsonResponse." + totalOrder[i]) + 1];
							break;
						}
					}
					bizResults += "<div class=\"infochip infochip-se\"><div class=\"infochip__icon\"><img class=\"se-question-image\" src=\"/static/" + tempPic + "-purple.png\"/></div><div class=\"infochip__desc\"><div class=\"infochip__desc__title\" style=\"white-space: normal\" title=\"Title\">" + tempDesc + "</div><div>" + tempStage + " with " + tempTeam + "</div></div><br /><br /></div>"
				}	

				document.getElementById("conversationPriority").getElementsByClassName("divTableCell")[2].innerHTML=bizResults;
			}


			//AUTONOMOUS
			var totalOrder = [];
			
			//Loop through the priorities
			var highOrder = {};
			var highCount = 0;
			for(i=0; i<autoPrios.length; i++) {
				var temp = eval("jsonResponse." + autoPrios[i] + "_prio");
				
				//If it's high and not POC, add it to the array
				if(temp == "high" && eval("jsonResponse." + autoPrios[i]) < 3) {
					highOrder[autoPrios[i]] = eval("jsonResponse." + autoPrios[i]);
					highCount++;
				}	
			}

			//Add the high ones to the total
			for (i=0; i<highCount; i++) {
				if(i < 3) {
					totalOrder.push(sortMe(highOrder)[i][0]);
				}	
			}


			//If not enough high priority, carry on to medium
			if(highCount < 3) {
				var mediumOrder = {};	
				var mediumCount = 0;
				for(i=0; i<autoPrios.length; i++) {
					var temp = eval("jsonResponse." + autoPrios[i] + "_prio");
					
					//If it's medium and not POC, add it to the array
					if(temp == "medium" && eval("jsonResponse." + autoPrios[i]) < 3) {
						mediumOrder[autoPrios[i]] = eval("jsonResponse." + autoPrios[i]);
						mediumCount++;
					}			
				}	
			}

			//For the remaining gaps, add medium ones as far as possible
			for (i=0; i<3-highCount; i++) {
				if(sortMe(mediumOrder)[i] != undefined && i < 3-highCount) {
					totalOrder.push(sortMe(mediumOrder)[i][0]);
				}	
			}		
	
			//If not enough medium, carry on to low
			
			if(totalOrder.length < 3) {	
				var lowOrder = {};
				var lowCount = 0;
				for(i=0; i<autoPrios.length; i++) {
					var temp = eval("jsonResponse." + autoPrios[i] + "_prio");
					
					//If it's low and not POC, add it to the array
					if(temp == "low" && eval("jsonResponse." + autoPrios[i]) < 3) {
						lowOrder[autoPrios[i]] = eval("jsonResponse." + autoPrios[i]);
						lowCount++;
					}					
				}				
			}		

			//For the remaining gaps, add low ones as far as possible
			var remaining = 3 - totalOrder.length;
			for (i=0; i<remaining; i++) {
				if(sortMe(lowOrder)[i] != undefined && i<remaining) {
					totalOrder.push(sortMe(lowOrder)[i][0]);
				}	
			}				
			
			if(totalOrder.length == 0) {
				console.log("nothing");
			}
			else {
				var convos = ["trends","causation","digital","bi","market","driving","healing","culture","automation","bill","tool_cons","devops","ai","integration","release","lifecycle","shift","perfect","migration","transaction"];
				var convo_desc = ["Improvement trends due to tuning and transaction monitoring","Correlation vs. causation","Digital experience insights","Integrate with BI solutions","Market insights via DT One","Self-driving IT","Self-healing","Culture change","Automation","Managing your cloud bill","Tool consolidation","Scaling for DevOps","AI-driven actions","Integrations and automation","How to release software faster","Integrate across application lifecycle","DevOps- shifting left","Delivering the perfect software experience","Cloud migration","Business transaction monitoring"];
				var convo_team = ["Application Owners","Application Owners","CxO","CxO","CxO","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","Operations team","Operations team","Operations team","Operations team","Development team","Development team","Development team","Application owner","Application owner","Application owner"];
				var convo_stage = ["not started","Conversation","Demonstration","POC"];
				var convo_pic = ["info","discuss","demo","trial"];
				
				var autoResults = "";
				for(i=0;i<totalOrder.length;i++) {
					for(x=0;x<convos.length;x++) {
						if(totalOrder[i] == convos[x]) {
							//console.log("matching " + totalOrder[i] + " with " + convos[x] + " and priority " + eval("jsonResponse." + totalOrder[i]));
							var tempDesc = convo_desc[x];
							var tempTeam = convo_team[x];
							var tempStage = convo_stage[eval("jsonResponse." + totalOrder[i]) + 1];
							var tempPic = convo_pic[eval("jsonResponse." + totalOrder[i]) + 1];
							break;
						}
					}
					autoResults += "<div class=\"infochip infochip-se\"><div class=\"infochip__icon\"><img class=\"se-question-image\" src=\"/static/" + tempPic + "-green.png\"/></div><div class=\"infochip__desc\"><div class=\"infochip__desc__title\" style=\"white-space: normal\" title=\"Title\">" + tempDesc + "</div><div>" + tempStage + " with " + tempTeam + "</div></div><br /><br /></div>"
				}	

				document.getElementById("conversationPriority").getElementsByClassName("divTableCell")[1].innerHTML=autoResults;	
			}

			//FULLSTACK
			var totalOrder = [];
			
			//Loop through the priorities
			var highOrder = {};
			var highCount = 0;
			for(i=0; i<fullstackPrios.length; i++) {
				var temp = eval("jsonResponse." + fullstackPrios[i] + "_prio");
				
				//If it's high and not POC, add it to the array
				if(temp == "high" && eval("jsonResponse." + fullstackPrios[i]) < 3) {
					highOrder[fullstackPrios[i]] = eval("jsonResponse." + fullstackPrios[i]);
					highCount++;
				}	
			}

			//Add the high ones to the total
			for (i=0; i<highCount; i++) {
				if(i < 3) {
					totalOrder.push(sortMe(highOrder)[i][0]);
				}	
			}


			//If not enough high priority, carry on to medium
			if(highCount < 3) {
				var mediumOrder = {};	
				var mediumCount = 0;
				for(i=0; i<fullstackPrios.length; i++) {
					var temp = eval("jsonResponse." + fullstackPrios[i] + "_prio");
					
					//If it's medium and not POC, add it to the array
					if(temp == "medium" && eval("jsonResponse." + fullstackPrios[i]) < 3) {
						mediumOrder[fullstackPrios[i]] = eval("jsonResponse." + fullstackPrios[i]);
						mediumCount++;
					}			
				}	
			}

			//For the remaining gaps, add medium ones as far as possible
			for (i=0; i<3-highCount; i++) {
				if(sortMe(mediumOrder)[i] != undefined && i < 3-highCount) {
					totalOrder.push(sortMe(mediumOrder)[i][0]);
				}	
			}		
	
			//If not enough medium, carry on to low
			
			if(totalOrder.length < 3) {	
				var lowOrder = {};
				var lowCount = 0;
				for(i=0; i<fullstackPrios.length; i++) {
					var temp = eval("jsonResponse." + fullstackPrios[i] + "_prio");
					
					//If it's low and not POC, add it to the array
					if(temp == "low" && eval("jsonResponse." + fullstackPrios[i]) < 3) {
						lowOrder[fullstackPrios[i]] = eval("jsonResponse." + fullstackPrios[i]);
						lowCount++;
					}					
				}				
			}		

			//For the remaining gaps, add low ones as far as possible
			var remaining = 3 - totalOrder.length;
			for (i=0; i<remaining; i++) {
				if(sortMe(lowOrder)[i] != undefined && i<remaining) {
					totalOrder.push(sortMe(lowOrder)[i][0]);
				}	
			}				
			
			if(totalOrder.length == 0) {
				console.log("nothing");
			}
			else {
				var convos = ["trends","causation","digital","bi","market","driving","healing","culture","automation","bill","tool_cons","devops","ai","integrations","release","lifecycle","shift","perfect","migration","transaction"];
				var convo_desc = ["Improvement trends due to tuning and transaction monitoring","Correlation vs. causation","Digital experience insights","Integrate with BI solutions","Market insights via DT One","Self-driving IT","Self-healing","Culture change","Automation","Managing your cloud bill","Tool consolidation","Scaling for DevOps","AI-driven actions","Integrations and automation","How to release software faster","Integrate across application lifecycle","DevOps- shifting left","Delivering the perfect software experience","Cloud migration","Business transaction monitoring"];
				var convo_team = ["Application Owners","Application Owners","CxO","CxO","CxO","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","CxO/Application owners","Operations team","Operations team","Operations team","Operations team","Development team","Development team","Development team","Application owner","Application owner","Application owner"];
				var convo_stage = ["not started","Conversation","Demonstration","POC"];
				var convo_pic = ["info","discuss","demo","trial"];
				

				var fullResults = "";
				for(i=0;i<totalOrder.length;i++) {
					for(x=0;x<convos.length;x++) {
						if(totalOrder[i] == convos[x]) {
							var tempDesc = convo_desc[x];
							var tempTeam = convo_team[x];
							var tempStage = convo_stage[eval("jsonResponse." + totalOrder[i]) + 1];
							var tempPic = convo_pic[eval("jsonResponse." + totalOrder[i]) + 1];
							break;
						}
					}
					fullResults += "<div class=\"infochip infochip-se\"><div class=\"infochip__icon\"><img class=\"se-question-image\" src=\"/static/" + tempPic + "-blue.png\"/></div><div class=\"infochip__desc\"><div class=\"infochip__desc__title\" title=\"Title\" style=\"white-space: normal\">" + tempDesc + "</div><div>" + tempStage + " with " + tempTeam + "</div></div><br /><br /></div>"
				}	

				document.getElementById("conversationPriority").getElementsByClassName("divTableCell")[0].innerHTML=fullResults;	
			}
			
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

			var check = new RegExp("report?").exec(window.location.href);
			var bulletpoints = "";
			var bulletcosts = "";

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

				console.log(jsonResponse);

				var existingy1 = 0;
				var existingy2 = 0;
				var existingy3 = 0;

				var addHtml = "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current tools to be replaced</b><div class=\"theme--green\"><ul class=\"list\">";
				var currentHtml = "";
				var expectedHtml = "";

				for(i=0;i<number;i++) {
					var ftes = 0;
					
					if(jsonResponse.existing_apps[i].ftes == "" || jsonResponse.existing_apps[i].ftes == null) {
						ftes = 0;	
					}
					else {
						ftes = jsonResponse.existing_apps[i].ftes;
					}

					annual_cost = (parseFloat(jsonResponse.existing_apps[i].annual_costs)) + (parseFloat(jsonResponse.existing_apps[i].ftes) * parseFloat(jsonResponse.operation_cost));
					percent1 = (parseFloat(jsonResponse.existing_apps[i].y1)/100);
					percent2 = (parseFloat(jsonResponse.existing_apps[i].y2)/100);
					percent3 = (parseFloat(jsonResponse.existing_apps[i].y3)/100);
					existingy1 = parseInt(existingy1 + (annual_cost * percent1));
					existingy2 = parseInt(existingy2 + (annual_cost * percent2));
					existingy3 = parseInt(existingy3 + (annual_cost * percent3));
					existingTotal = existingy1 + existingy2 + existingy3;
					
					if(check != null) {
						currentHtml += "<li>" + jsonResponse.existing_apps[i].name + ": <b>" + processMoney(jsonResponse.existing_apps[i].annual_costs.toString()) + "</b> annual costs, <b>" + jsonResponse.existing_apps[i].ftes + "</b> FTEs used for configuration and maintenance</li>";
					}

					if(check != null) {
						expectedHtml += "<li>" + jsonResponse.existing_apps[i].name + ": <b>" + processPercent(jsonResponse.existing_apps[i].y1.toString()) + "</b> replaced in year 1, <b>" + processPercent(jsonResponse.existing_apps[i].y2.toString()) + "</b> replaced in year 2 and <b>" + processPercent(jsonResponse.existing_apps[i].y3.toString()) + "</b> replaced in year 3</li>";
					}
				}

				addHtml += currentHtml;
				addHtml += "</ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected replacements</b><div class=\"theme--green\"><ul class=\"list\">";

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/ops-reduced-tools.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 15px\"><h3>Reduction of existing monitoring tools</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(existingTotal.toString()) + "</b></dd></dl>";

				if(check != null) {
					addHtml += expectedHtml;
					addHtml += "</ul></div></div></div></div></div></div><br /><br />";
					newHtml += addHtml;
				}

				//var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-reduced-tools.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Reduction of existing monitoring tools</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(existingy3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(existingTotal.toString()) + "</b></dd></dl></div></div>";

				document.getElementById("ops-reduced-tools").innerHTML=newHtml;

				if($('#operations').css('display') == "none") {
					$('#operations').fadeIn();
				}

				bulletpoints += "<li>License cost and effort reduction through tool consolidation: <b>" + processMoney(existingTotal.toString()) + "</b></li>";

				var opsCase1 = 1;
			}

			//BUSINESS - revenue increase
			revenue = parseFloat(getNumbersAndDots(document.getElementById("company_revenue").value));

			percent = parseFloat(getNumbersAndDots(document.getElementById("revenue_dependent").value));
			percent = percent / 100;

			growth = parseFloat(getNumbersAndDots(document.getElementById("projected_growth").value));
			growth = growth / 100;

			uptime = parseFloat(getNumbersAndDots(document.getElementById("app_uptime").value));
			uptime = uptime / 100;

			breach = parseFloat(getNumbersAndDots(document.getElementById("revenue_breach").value));
			breach = breach / 100;

			benefit_sla = parseInt(getNumbersAndDots(document.getElementById("benefit_sla").value));
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
		
				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/biz-increased-revenue.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 15px\"><h3>Revenue gained by reduced incidents, downtime, and slowness</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueDowntimeY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(revenueDowntimeTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--purple\"><ul class=\"list\"><li>Company or business unit annual revenue: <b>" + processMoney(revenue.toString()) + "</b></li><li>Annual growth rate: <b>" + processPercent((growth * 100).toString()) + "</b></li><li>Revenue directly dependant on applications: <b>" + processPercent((percent * 100).toString()) + "</b></li><li>Overall uptime excluding planned maintenance and downtime: <b>" + processPercent((uptime * 100).toString()) + "</b></li><li>Percentage of application-dependant revenue which is lost per year due to outages or poor performance: <b>" + processPercent((breach * 100).toString()) + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--purple\"><ul class=\"list\"><li>Expected increase in uptime after Dynatrace: <b>" + processPercent((benefit_sla * 100).toString()) + "</b></li></ul></div></div></div></div></div></div><br /><br />";
				}

				document.getElementById("biz-increased-revenue").innerHTML=newHtml;

				bulletpoints += "<li>Increased potential revenue, through a reduction in downtime or unacceptable performance: <b>" + processMoney(revenueDowntimeTotal.toString()) + "</b></li>";

				var bizCase1 = 1;

				if($('#business').css('display') == "none") {
					$('#business').fadeIn();
				}
			}

			//BUSINESS - conversions
			revenue = parseFloat(getNumbersAndDots(document.getElementById("company_revenue").value));

			percent = parseFloat(getNumbersAndDots(document.getElementById("revenue_dependent").value));
			percent = percent / 100;

			conversion = parseFloat(getNumbersAndDots(document.getElementById("benefit_conversion").value));
			conversion = conversion / 100;

			growth = parseFloat(getNumbersAndDots(document.getElementById("projected_growth").value));
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

				// var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/biz-increased-conversions.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Revenue from increased conversions caused by better user experience and app performance</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(revenueConversionTotal.toString()) + "</b></dd></dl></div></div>";

				// if(check != null) {
				// 	newHtml += "<br /><div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\">Current situation<ul class=\"list\"><li>Company or business unit annual revenue: <b>" + processMoney(revenue.toString()) + "</b></li><li>Annual growth rate: <b>" + processPercent((growth * 100).toString()) + "</b></li><li>Revenue directly dependant on applications: <b>" + processPercent((percent * 100).toString()) + "</b></li></ul></div><div class=\"divTableCell\" style=\"width: 50%\">Expected improvements<ul class=\"list\"><li>Expected increase in conversions after Dynatrace: <b>" + processPercent((conversion * 100).toString()) + "</b></li></ul></div></div></div></div></div>";
				// }

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/biz-increased-conversions.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 10px\"><h3>Revenue from increased conversions caused by better user experience and app performance</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(revenueConversionY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(revenueConversionTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--purple\"><ul class=\"list\"><li>Company or business unit annual revenue: <b>" + processMoney(revenue.toString()) + "</b></li><li>Annual growth rate: <b>" + processPercent((growth * 100).toString()) + "</b></li><li>Revenue directly dependant on applications: <b>" + processPercent((percent * 100).toString()) + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--purple\"><ul class=\"list\"><li>Expected increase in conversions after Dynatrace: <b>" + processPercent((conversion * 100).toString()) + "</b></li></ul></div></div></div></div></div></div><br />";
				}

				document.getElementById("biz-increased-conversions").innerHTML=newHtml;

				if($('#business').css('display') == "none") {
					$('#business').fadeIn();
				}

				bulletpoints += "<li>Increased potential revenue from more conversions, caused by better user experience: <b>" + processMoney(revenueConversionTotal.toString()) + "</b></li>";

				var bizCase2 = 1;
			}

			if(bizCase1 + bizCase2 == 0) {
				$('#business').fadeOut();
			}

			//OPERATIONS - incident reduction
			incidents_month = parseFloat(getNumbersAndDots(document.getElementById("incidents_month").value));

			if(document.getElementById("projected_growth").value == "") {
				growth = 0;
			}
			else {
				growth = parseFloat(getNumbersAndDots(document.getElementById("projected_growth").value));
				growth = growth / 100;
			}

			no_ops_troubleshoot = parseFloat(getNumbersAndDots(document.getElementById("no_ops_troubleshoot").value));

			no_dev_troubleshoot = parseFloat(getNumbersAndDots(document.getElementById("no_dev_troubleshoot").value));

			mttr = parseFloat(getNumbersAndDots(document.getElementById("mttr").value));

			benefit_incident_reduction = parseFloat(getNumbersAndDots(document.getElementById("benefit_incident_reduction").value));

			benefit_incident_reduction = benefit_incident_reduction / 100;

			benefit_mttr = parseFloat(getNumbersAndDots(document.getElementById("benefit_mttr").value));
			benefit_mttr = benefit_mttr / 100;

			ops_cost = parseFloat(getNumbersAndDots(document.getElementById("operation_cost").value));

			dev_cost = parseFloat(getNumbersAndDots(document.getElementById("developer_cost").value));

			work_hours = parseFloat(getNumbersAndDots(document.getElementById("work_hours").value));

			if(isNaN(incidents_month) == true || incidents_month == 0 || isNaN(growth) == true || isNaN(no_ops_troubleshoot) == true || isNaN(no_dev_troubleshoot) == true || isNaN(mttr) == true || mttr == 0 || isNaN(benefit_incident_reduction) == true || benefit_incident_reduction == 0 || isNaN(benefit_mttr) == true || benefit_mttr == 0 || isNaN(ops_cost) == true || ops_cost == 0 || isNaN(dev_cost) == true || dev_cost == 0 || isNaN(work_hours) == true || work_hours == 0) {
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


				//var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-reduced-incidents.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Incident reduction and faster MTTR in production (cost of war room effort)</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(opsIncidentCostTotal.toString()) + "</b></dd></dl></div></div>";

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/ops-reduced-incidents.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 5px\"><h3>Incident reduction and faster MTTR in production (cost of war room effort)</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(opsIncidentCostY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(opsIncidentCostTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--green\"><ul class=\"list\"><li>Number of incidents reported per month caused by slowness or availability: <b>" + incidents_month.toString() + "</b></li><li>Average number of Ops people used to troubleshoot an incident: <b>" + no_ops_troubleshoot.toString() + "</b></li><li>Average number of Dev people used to troubleshoot an incident: <b>" + no_dev_troubleshoot.toString() + "</b></li><li>Average MTTR (minutes): <b>" + mttr.toString() + "</b></li><li>Fully loaded cost of operations person: <b>" + processMoney(ops_cost.toString()) + "</b></li><li>Fully loaded cost of development person: <b>" + processMoney(dev_cost.toString()) + "</b></li><li>Work hours per year: <b>" + work_hours.toString() + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--green\"><ul class=\"list\"><li>Incident reduction in production through pro-active detection: <b>" + processPercent((benefit_incident_reduction * 100).toString()) + "</b></li><li>Faster MTTR and root cause analysis in production: <b>" + processPercent((benefit_mttr * 100).toString()) + "</b></li></ul></div></div></div></div></div></div><br />";
				}

				document.getElementById("ops-reduced-incidents").innerHTML=newHtml;

				if($('#operations').css('display') == "none") {
					$('#operations').fadeIn();
				}

				bulletpoints += "<li>Reduced costs associated with resolving an IT incident: <b>" + processMoney(opsIncidentCostTotal.toString()) + "</b></li>";

				var opsCase2 = 1;
			}

			//OPERATIONS - cost of automation
			no_fte_existing = parseFloat(getNumbersAndDots(document.getElementById("no_fte_existing").value));

			no_apps_e2e = parseFloat(getNumbersAndDots(document.getElementById("no_apps_e2e").value));

			no_t1t2_apps = parseFloat(getNumbersAndDots(document.getElementById("no_t1t2_apps").value));

			benefit_config = parseFloat(getNumbersAndDots(document.getElementById("benefit_config").value));
			benefit_config = benefit_config / 100;

			if(isNaN(no_fte_existing) == true || no_fte_existing == 0 || isNaN(no_apps_e2e) == true || no_apps_e2e == 0 || isNaN(no_t1t2_apps) == true || no_t1t2_apps == 0 || isNaN(benefit_config) == true || benefit_config == 0 || isNaN(growth) == true) {
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

				//var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/ops-increased-automation.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Cost savings with Dynatrace automation vs. manual effort </p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(effortSavingTotal.toString()) + "</b></dd></dl></div></div>";

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/ops-increased-automation.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 5px\"><h3>Cost savings with Dynatrace automation vs. manual effort</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(effortSavingY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(effortSavingTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--green\"><ul class=\"list\"><li>Number of applications being monitored end-to-end currently: <b>" + no_apps_e2e.toString() + "</b></li><li>Number of T1/T2 applications currently in production: <b>" + no_t1t2_apps.toString() + "</b></li><li>Number of FTEs looking after existing monitoring tools: <b>" + no_fte_existing.toString() + "</b></li><li>Fully loaded cost of operations person: <b>" + processMoney(ops_cost.toString()) + "</b></li><li>Work hours per year: <b>" + work_hours.toString() + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--green\"><ul class=\"list\"><li>Reduced time spent implementing and configuring vs. existing tools: <b>" + processPercent((benefit_config * 100).toString()) + "</b></li></ul></div></div></div></div></div></div><br />";
				}

				document.getElementById("ops-increased-automation").innerHTML=newHtml;

				if($('#operations').css('display') == "none") {
					$('#operations').fadeIn();
				}

				bulletpoints += "<li>Reduction in operational costs associated with managing many existing and complex tools: <b>" + processMoney(effortSavingTotal.toString()) + "</b></li>";

				var opsCase3 = 1;

			}

			if(opsCase1 + opsCase2 + opsCase3 == 0) {
				$('#operations').fadeOut();
			}

			//DEV AND QA - effort

			cycles_per_year = parseFloat(getNumbersAndDots(document.getElementById("cycles_per_year").value));

			cycle_days = parseFloat(getNumbersAndDots(document.getElementById("cycle_days").value));

			test_per_cycle = parseFloat(getNumbersAndDots(document.getElementById("test_per_cycle").value));
			test_per_cycle = test_per_cycle / 100;

			qa_time_per_cycle = parseFloat(getNumbersAndDots(document.getElementById("qa_time_per_cycle").value));
			qa_time_per_cycle = qa_time_per_cycle / 100;

			qa_people_per_cycle = parseFloat(getNumbersAndDots(document.getElementById("qa_people_per_cycle").value));

			dev_time_per_cycle = parseFloat(getNumbersAndDots(document.getElementById("dev_time_per_cycle").value));
			dev_time_per_cycle = dev_time_per_cycle / 100;

			dev_people_per_cycle = parseFloat(getNumbersAndDots(document.getElementById("dev_people_per_cycle").value));

			benefit_fix_qa = parseFloat(getNumbersAndDots(document.getElementById("benefit_fix_qa").value));
			benefit_fix_qa = benefit_fix_qa / 100;

			qa_cost = parseFloat(getNumbersAndDots(document.getElementById("qa_cost").value));

			if(isNaN(cycles_per_year) == true || cycles_per_year == 0 || isNaN(cycle_days) == true || cycle_days == 0 || isNaN(test_per_cycle) == true || test_per_cycle == 0 || isNaN(qa_time_per_cycle) == true || qa_time_per_cycle == 0 || isNaN(qa_people_per_cycle) == true || qa_people_per_cycle == 0 || isNaN(dev_time_per_cycle) == true || dev_time_per_cycle == 0 || isNaN(dev_people_per_cycle) == true || dev_people_per_cycle == 0 || isNaN(benefit_fix_qa) == true || benefit_fix_qa == 0 || isNaN(qa_cost) == true || qa_cost == 0 || isNaN(growth) == true) {
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

				//var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/dev-decreased-investigation.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Performance defect investigation and troubleshooting in QA</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devQaTotal.toString()) + "</b></dd></dl></div></div>";

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/dev-decreased-investigation.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 5px\"><h3>Performance defect investigation and troubleshooting in QA</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devQaY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devQaTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--blue\"><ul class=\"list\"><li>Number of release cycles per year for all applications: <b>" + cycles_per_year.toString() + "</b></li><li>Number of days to complete a release cycle: <b>" + cycle_days.toString() + "</b></li><li>Percentage of time spent testing per release cycle: <b>" + processPercent((test_per_cycle * 100).toString()) + "</b></li><li>Amount of QA testing time spent documenting performance issues: <b>" + processPercent((qa_time_per_cycle * 100).toString()) + "</b></li><li>Number of QA people documenting performance issues per release: <b>" + qa_people_per_cycle.toString() + "</b></li><li>Amount of dev testing time spent documenting performance issues: <b>" + processPercent((dev_time_per_cycle * 100).toString()) + "</b></li><li>Number of dev people documenting performance issues per release: <b>" + dev_people_per_cycle.toString() + "</b></li><li>Fully loaded cost of QA person: <b>" + processMoney(qa_cost.toString()) + "</b></li><li>Fully loaded cost of development person: <b>" + processMoney(dev_cost.toString()) + "</b></li><li>Work hours per year: <b>" + work_hours.toString() + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--blue\"><ul class=\"list\"><li>Reduced time finding and fixing performance problems in QA: <b>" + processPercent((benefit_fix_qa * 100).toString()) + "</b></li></ul></div></div></div></div></div></div><br />";
				}

				document.getElementById("dev-decreased-investigation").innerHTML=newHtml;

				if($('#development').css('display') == "none") {
					$('#development').fadeIn();
				}

				bulletpoints += "<li>Increased cost efficiences associated with solving performance issues in pre-production: <b>" + processMoney(devQaTotal.toString()) + "</b></li>";

				var devCase1 = 1;
			}
			//DEV AND QA - fewer incidents

			incidentsYear = incidents_month * 12;
			opsHours = incidentsYear * no_ops_troubleshoot * (mttr / 60);
			opsCost = opsHours * (ops_cost / work_hours);
			devHours = incidentsYear * no_dev_troubleshoot * (mttr / 60);
			devCost = devHours * (dev_cost / work_hours);
			incidentCost = opsCost + devCost;

			benefit_prod_reduction = parseFloat(getNumbersAndDots(document.getElementById("benefit_prod_reduction").value));
			benefit_prod_reduction = benefit_prod_reduction / 100;

			if(isNaN(incidentsYear) == true || incidentsYear == 0 || isNaN(opsHours) == true || opsHours == 0 || isNaN(opsCost) == true || opsCost == 0 || isNaN(devHours) == true || devHours == 0 || isNaN(devCost) == true || devCost == 0 || isNaN(incidentCost) == true || incidentCost == 0 || isNaN(benefit_prod_reduction) == true || benefit_prod_reduction == 0 || isNaN(incidents_month) == true || incidents_month == 0 || isNaN(no_ops_troubleshoot) == true || no_ops_troubleshoot == 0 || isNaN(no_dev_troubleshoot) == true || no_dev_troubleshoot == 0 || isNaN(work_hours) == true || work_hours == 0 || isNaN(mttr) == true || mttr == 0 || isNaN(growth) == true) {
				devLowerIncidentsY1 = 0;
				devLowerIncidentsY2 = 0;
				devLowerIncidentsY3 = 0;
				devLowerIncidentsTotal = 0;

				document.getElementById("dev-decreased-incidents").innerHTML="";

				var devCase2 = 0;
			}

			else {
				devLowerIncidentsY1 = parseInt(incidentCost * (1 - benefit_prod_reduction));
				devLowerIncidentsY2 = parseInt(devLowerIncidentsY1 * (1+growth));
				devLowerIncidentsY3 = parseInt(devLowerIncidentsY2 * (1+growth));
				devLowerIncidentsTotal = devLowerIncidentsY1 + devLowerIncidentsY2 + devLowerIncidentsY3;

				//var newHtml = "<div class=\"section\" style=\"width: 90%; overflow: auto; margin-left: 5%\"><div class=\"column--3-of-6\"><div style=\"display:inline-block; width: 20%; max-width: 20%; padding-top: 15px; vertical-align: middle;\" ><img src=\"/static/results/dev-decreased-incidents.png\" height=\"100px\" width=\"100px\" /></div><div style=\"display: inline-block; width: 75%; max-width: 75%; margin-left: 2%; vertical-align: middle; padding-top: 10px\"><p>Fewer production incidents by finding & fixing performance defects in QA & Dev</p></div></div><div class=\"column--3-of-6\"><dl class=\"definition-list\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devLowerIncidentsTotal.toString()) + "</b></dd></dl></div></div>";

				var newHtml = "<div style=\"margin-left: 5%; width: 90%; font-family: BerninaSansLight\"><div style=\"width: 10%; float: left\"><img src=\"/static/results/dev-decreased-incidents.png\" height=\"60px\" width=\"60px\" /></div><div style=\"width: 90%; padding-top: 5px\"><h3>Fewer production incidents by finding & fixing performance defects in QA & Dev</h3></div><br /><dl class=\"definition-list\" style=\"margin-left: 5%; width: 90%\"><dt>Year 1</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY1.toString()) + "</dd><dt>Year 2</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY2.toString()) + "</dd><dt>Year 3</dt><dd style=\"font-size: 1.2em\">" + processMoney(devLowerIncidentsY3.toString()) + "</dd><dt>Total</dt><dd style=\"font-size: 1.2em\"><b>" + processMoney(devLowerIncidentsTotal.toString()) + "</b></dd></dl>";


				if(check != null) {
					newHtml += "<br /><div style=\"font-family: BerninaSansLight\"><div class=\"divTable\" style=\"width: 100%\"><div class=\"divTableBody\"><div class=\"divTableRow\"><div class=\"divTableCell\" style=\"width: 50%\"><b>Current situation</b><div class=\"theme--blue\"><ul class=\"list\"><li>Number of incidents reported per month caused by slowness or availability: <b>" + incidents_month.toString() + "</b></li><li>Average number of Ops people used to troubleshoot an incident: <b>" + no_ops_troubleshoot.toString() + "</b></li><li>Average number of Dev people used to troubleshoot an incident: <b>" + no_dev_troubleshoot.toString() + "</b></li><li>Average MTTR (minutes): <b>" + mttr.toString() + "</b></li><li>Fully loaded cost of operations person: <b>" + processMoney(ops_cost.toString()) + "</b></li><li>Fully loaded cost of development person: <b>" + processMoney(dev_cost.toString()) + "</b></li><li>Work hours per year: <b>" + work_hours.toString() + "</b></li></ul></div></div><div class=\"divTableCell\" style=\"width: 50%\"><b>Expected improvements</b><div class=\"theme--blue\"><ul class=\"list\"><li>Incident reduction in production by finding and fixing defects in Dev and QA: <b>" + processPercent((parseInt(benefit_prod_reduction * 100)).toString()) + "</b></li></ul></div></div></div></div></div></div><br />";
				}

				document.getElementById("dev-decreased-incidents").innerHTML=newHtml;
				if($('#development').css('display') == "none") {
					$('#development').fadeIn();
				}

				bulletpoints += "<li>Increased potential revenue by finding major bugs in pre-production, before they affect real customers: <b>" + processMoney(devLowerIncidentsTotal.toString()) + "</b></li>";

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
					document.getElementById("devTotal").innerHTML = "<b>" + processMoney(devTotal.toString()) + "</b>";
				}
			}

			else {
				devY1 = null;
				devY2 = null;
				devY3 = null;
				devTotal = null;

				$('#developmentRow').remove();
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
					document.getElementById("opsTotal").innerHTML = "<b>" + processMoney(operationsTotal.toString()) + "</b>";
				}
			}

			else {
				operationsY1 = null;
				operationsY2 = null;
				operationsY3 = null;
				operationsTotal = null;

				$('#operationsRow').remove();
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
					document.getElementById("bizTotal").innerHTML = "<b>" + processMoney(revenueGainTotal.toString()) + "</b>";
				}
			}

			else {
				revenueGainY1 = null;
				revenueGainY2 = null;
				revenueGainY3 = null;
				revenueGainTotal = null;

				$('#businessRow').remove();
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
					data: [devY1, devY2, devY3]
				}, {
					name: 'Operations',
					data: [operationsY1, operationsY2, operationsY3]
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

				if(document.getElementById("y1_software").value == "") {
					y1_software = 0;
				}
				else {
					y1_software = parseInt(getNumbers(document.getElementById("y1_software").value));
				}

				if(document.getElementById("y2_software").value == "") {
					y2_software = 0;
				}
				else {
					y2_software = parseInt(getNumbers(document.getElementById("y2_software").value));
				}

				if(document.getElementById("y3_software").value == "") {
					y3_software = 0;
				}
				else {
					y3_software = parseInt(getNumbers(document.getElementById("y3_software").value));
				}

				if(document.getElementById("y1_services").value == "") {
					y1_services = 0;
				}
				else {
					y1_services = parseInt(getNumbers(document.getElementById("y1_services").value));
				}

				if(document.getElementById("y2_services").value == "") {
					y2_services = 0;
				}
				else {
					y2_services = parseInt(getNumbers(document.getElementById("y2_services").value));
				}

				if(document.getElementById("y3_services").value == "") {
					y3_services = 0;
				}
				else {
					y3_services = parseInt(getNumbers(document.getElementById("y3_services").value));
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

				var y1 = ""; 
				var y2 = ""; 
				var y3 = "";

				if(y1_software != 0) {
					y1 += "<li>Year 1: <b>" + processMoney(y1_software.toString()) + "</b> in software";
				}			

				if(y1_services != 0) {
					if(y1 != "") { y1 += ", <b>" + processMoney(y1_services.toString()) + "</b> on services</li>" ; }
					else { y1 += "<li>Year 1: <b>" + processMoney(y1_services.toString()) + "</b> on services</li>"; }
				}

				if(y2_software != 0) {
					y2 += "<li>Year 2: <b>" + processMoney(y2_software.toString()) + "</b> in software";
				}			
				
				if(y2_services != 0) {
					if(y2 != "") { y2 += ", <b>" + processMoney(y2_services.toString()) + "</b> on services</li>" ; }
					else { y2 += "<li>Year 2: <b>" + processMoney(y2_services.toString()) + "</b> on services</li>"; }
				}

				if(y3_software != 0) {
					y3 += "<li>Year 3: <b>" + processMoney(y3_software.toString()) + "</b> in software";
				}			
				
				if(y3_services != 0) {
					if(y3 != "") { y3 += ", <b>" + processMoney(y3_services.toString()) + "</b> on services</li>" ; }
					else { y3 += "<li>Year 3: <b>" + processMoney(y3_services.toString()) + "</b> on services</li>"; }
				}

				bulletcosts += y1;
				bulletcosts += y2;
				bulletcosts += y3;

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

			//Add bullets
			if(check != null) {
				document.getElementById("overall_points").innerHTML=bulletpoints;
				document.getElementById("software_costs").innerHTML=bulletcosts;
			}
	})


}

function reportData() {
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
		
	})
}
