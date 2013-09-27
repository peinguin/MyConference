var express = require("express");

module.exports = exports = function(app){
	var docs_handler = express.static(__dirname + '/../static/');
	app.get(/^\/static(\/.*)?$/, function(req, res, next) {
		if (req.url === '/static') { // express static barfs on root url w/o trailing slash
			res.writeHead(302, { 'Location' : req.url + '/' });
			res.end();
			return;
		}
		// take off leading /docs so that connect locates file correctly
		req.url = req.url.substr('/docs'.length);
		return docs_handler(req, res, next);
	});
}