var user = require('./controllers/user');

exports.init = function(swagger) {
	swagger.addPost(user.post);
}