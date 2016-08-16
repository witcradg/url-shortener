'use strict';

var log = function (args) {
	var str = '';
		for (var i = 0; i < arguments.length; i++) {
			str += arguments[i] + ' ';    	

	}
	//console.log(str);
}

function logicHandler(db) {  
	var urls = db.collection('urls');
	
	this.getUrl = function(req, res) {
		log("getUrl called");
		var value = req.params.value;
  		if (value == 'favicon.ico') { log('skipping favicon'); return;}
  		log("value:",value);
		log("JSON value:",JSON.stringify(value));

  		urls.findOne( {'short_url': value }, { '_id': false }, function(err, record) {
  			log("findOne result:",JSON.stringify(record));
			if (err) { throw err; }
			if (record) {
				log("record.original_url:", record.original_url);
				res.redirect(record.original_url);		
				res.end();//not required when using res.send, not sure about res.redirect				
			} else {
				res.send("error: " + value + " This url is not in the database.");
			}
		});
	},
	
	/**
	 * This will determine whether the user is trying to create a new url.
	 * It performs some validation and then calls local method to createUrl if needed.
	 */
	this.processSubmittedUrl = function(req, res, next) {
	    log("processSubmittedUrl req.url:", req.url);
		var requrl = req.url.toLowerCase();
		var tmp = requrl.split('/');
		if ( tmp.length > 2) {
			log("checking create criteria");
			if ( tmp.length < 5  
			  || tmp[1] != 'new' 
			  || !requrl.match('http://|https://')) 
			{ 
				log("failed create criteria");
				res.send({"error":"Wrong url format, make sure you have a valid protocol and real site."});			
				return;
			}
			
			var originalUrl = requrl.substr(requrl.indexOf('http'));
	
			createUrl(originalUrl, urls, function( err, shortUrl) {
				log("createUrl callback");
				if (err) { throw err; }
				var obj = {
					'original_url': originalUrl,
					'short_url': req.headers.host + '/' + shortUrl
				};
				res.send(JSON.stringify(obj, null, ' '));
			});
		} else {
			log("not a create - may be home page request or a getUrl request");
	    	next(); 
		}
	}
}

var createUrl = function(originalUrl, urls, callback) {
	log('createUrl originalUrl', originalUrl);
	urls.count({}, function (err, count) {
		if (err) {
			throw err;
		}
		var shortUrl = (1000 + count + 1).toString();//simplify lookup
    	log("shortUrl:", shortUrl);
    	//could be improved with a lookup on the original to return any existing document pointing at the same original
		//would be safer with a unique index on short_url to prevent simutaneous submissions returning the same count
		urls.insert( {'original_url': originalUrl, 'short_url': shortUrl }, function(err) {
			if (err) { log('error detected in insert'); }
			callback(err, shortUrl);
		});
	});
}


module.exports = logicHandler;


