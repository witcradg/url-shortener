'use strict';

//var LogicHandler = require(process.cwd() + '/app/controllers/logicHandler.server.js'); 
	
module.exports = function (router, db) {
	console.log("entered index.js function");
	
//	var logicHandler = new LogicHandler(db);
	
	// route middleware that will happen on every request
	router.use(function(req, res, next) {
	    // log each request to the console
	    console.log("req.url:", req.url);
		var url = req.url.toLowerCase();
		//if we have a request that follows the required 'protocol'
		//handle as a create proess and return res.send(JSON.stringify(value, null, ' '));
		var tmp = url.split('/');
		console.log("tmp: ", JSON.stringify(tmp));
		if (tmp.length > 1 && tmp[1] == 'new') {
			if (tmp.length > 4 ) {
				if (url.match('http://|https://')) { //TODO replace with simple indexOf?
					var shortenUrl = url.substr(url.indexOf('http'));
					console.log('shortenUrl', shortenUrl);
					//database activity including establishing replacement value
					// Example creation output
					// { "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
					var obj = {
						'original_url': shortenUrl,
						'short_url': 'temporary placeholder'
					};
					res.send(JSON.stringify(obj, null, ' '));
				}
			}
			res.send({"error":"Wrong url format, make sure you have a valid protocol and real site."});			
		}
	    // continue doing what we were doing and go to the route
	    next(); 
	});	

    // Provide all routes here, this is for Home page.
    router.get("/",function(req,res){
		res.sendFile(process.cwd() + '/public/index.html');
    });
    
    router.get("/:value",function(req,res){
  		var value = req.params;
  		console.log("value:",value);
  		//do lookup of value in the database and return the original url
  		//validate that the value is all digits (required id for lookup)
  		//TODO if lookup fails return {"error":"This url is not in the database."}
  		res.send(JSON.stringify(value, null, ' '));
  	});
}
