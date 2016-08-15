'use strict';

function clickHandler(db) {
console.log("tp1 click handler called"); //NOTE: This is called on startup
	var clicks = db.collection('clicks');

	this.addClick = function(req, res) {
		clicks.findAndModify( {} , {'_id': 1}, { $inc: { 'clicks': 1 } }, function(err, result) {
			if (err) { throw err; }
			res.json(result);
		});
	};
	this.resetClicks = function(req, res) {
		clicks.update({}, { 'clicks': 0 }, function(err, result) {
			if (err) { throw err; }
			res.json(result);	
		});
	};
	this.getClicks = function(req, res) {
console.log("tp2 getClicks in controller client"); //NOTE: This is called on startup
		console.log("req.url",req.url);
		
		var clickProjection = { '_id': false };
		clicks.findOne({}, clickProjection, function (err, result) {
			if (err) {
				throw err;
			}
			if (result) {
				res.json(result);
			} else {
				clicks.insert( {'clicks': 0 }, function(err) {
					if (err) {
						throw err;
					}
			        clicks.findOne({}, clickProjection, function (err, result) {
           				 if (err) {
			                throw err;
           				 }
						res.json(result);
					});
				});
			}
		});
	};
}
module.exports = clickHandler;
