var user = require('./controllers/user');
var auth = require('./controllers/auth');
var conferences = require('./controllers/conferences');
var stream = require('./controllers/stream');

exports.init = function(swagger) {
	swagger.addPost(user.post);
	swagger.addGET(user.email);
	swagger.addGET(user.get);
	swagger.addPUT(user.change);

	swagger.addPost(auth.post);
	swagger.addPost(auth.facebook);
	swagger.addGET(auth.twitter);
	swagger.addGET(auth.twitterCallbackAuthorized);
	swagger.addGET(auth.twitterCallback);
	swagger.addPost(auth.linkedin);
	swagger.addPost(auth.google);
	swagger.addDELETE(auth.del);

	swagger.addGET(conferences.get);
	swagger.addGET(conferences.list);
	swagger.addPOST(conferences.decision);
	swagger.addDELETE(conferences.reject);

	swagger.addGET(stream.get);
	swagger.addGET(stream.list);
}