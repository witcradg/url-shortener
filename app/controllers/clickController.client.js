'use strict';

(function () {
console.log("tp0 start click controller client");
	var addButton = document.querySelector('.btn-add');
	var deleteButton = document.querySelector('.btn-delete');
	var clickNbr = document.querySelector('#click-nbr');
	var apiUrl = 'https://oh-my-darlin-witcradg.c9users.io/api/clicks';
console.log("tp1");
	function ready(fn) {
console.log("tp2 ready called");
		if (typeof fn != 'function') { return; }

		if (document.readyState === 'complete') { return fn(); }

		document.addEventListener('DOMContentLoaded', fn, false);
	}

	function ajaxRequest(method, url, callback) {
console.log("tp3 ajaxRequest called for",method);
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				callback(xmlhttp.response);	
	    	}
		};
		xmlhttp.open(method, url, true);
		xmlhttp.send();
	}

	function updateClickCount(data) {
		var clicksObject = JSON.parse(data); 
		clickNbr.innerHTML = clicksObject.clicks;	
	}

console.log("tp4");
	ready(ajaxRequest('GET', apiUrl, updateClickCount));

	addButton.addEventListener('click', function () {
		ajaxRequest('POST', apiUrl, function() {
    		ajaxRequest('GET', apiUrl, updateClickCount);
		});	
	}, false);

	deleteButton.addEventListener('click', function () {
		ajaxRequest('DELETE', apiUrl, function () {
			ajaxRequest('GET', apiUrl, updateClickCount);
		});
	}, false);

})();
