var swagger = require("swagger-node-express"),
	models = require("./models"),
	controllers = require('./controllers'),
	express = require("express");

exports.init = function (app) {
	swagger.setAppHandler(app);
	swagger.addModels(models);
	controllers.init(swagger);
	swagger.configure("http://localhost:8002", "0.1");
	// Serve up swagger ui at /docs via static route
	var docs_handler = express.static(__dirname + '/../documentation/swagger/');
	app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
	  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
	    res.writeHead(302, { 'Location' : req.url + '/' });
	    res.end();
	    return;
	  }
	  // take off leading /docs so that connect locates file correctly
	  req.url = req.url.substr('/docs'.length);
	  return docs_handler(req, res, next);
	});
}