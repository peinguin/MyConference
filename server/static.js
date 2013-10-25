var express = require("express");

module.exports = exports = function(app){
	var static_handler = express.static(__dirname + '/../static/');
	app.get(/^\/static(\/.*)?$/, function(req, res, next) {
		if (req.url === '/static') { // express static barfs on root url w/o trailing slash
			res.writeHead(302, { 'Location' : req.url + '/' });
			res.end();
			return;
		}

		req.url = req.url.substr('/static'.length);
		return static_handler(req, res, next);
	});

	var main_handler = express.static(__dirname + '/../client/www/');
	app.get(/^\/(.*)$/, function(req, res, next) {
		req.url = req.url.substr('/'.length);
		if(!req.url){
			req.url = 'index.html';
		}
		return main_handler(req, res, next);
	});
}