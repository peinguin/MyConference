var user = require('./controllers/user');
var auth = require('./controllers/auth');
var conferences = require('./controllers/conferences');

exports.init = function(swagger) {
	swagger.addPost(user.post);
	swagger.addGET(user.email);
	swagger.addPost(auth.post);
	swagger.addDELETE(auth.del);
	swagger.addGET(conferences.get);
}