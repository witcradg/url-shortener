'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;

var app = express();
var router = express.Router();

//export MONGOLAB_URI="mongodb://<dbuser>:<dbpassword>@ds161175.mlab.com:61175/fcc-dgw"
var url = process.env.MONGOLAB_URI;

mongo.connect(url, function (err, db) {
    if (err) {
    	throw new Error('Database failed to connect!');
    } else {
    	console.log('MongoDB successfully connected on port 61175.');
    }
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use("/",router);
    routes(router,db);

    app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
        console.log("server listening");
    });
});
