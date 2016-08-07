'use strict';

var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.sendfile(process.cwd() + '/index.html');
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("server listening");
});
