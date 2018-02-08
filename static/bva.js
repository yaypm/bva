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

function test() {
	var value = "bum";
	
	if (value == "bum") {
		return true;
	}
	else {
		return false;
	}
}