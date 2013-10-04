var post = {
	'spec': {
		"description" : "Register new user",
		"path" : "/user.{format}",
		"notes" : "Register new user",
		"summary" : "Register new user",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "User",
	            "description": "User to register",
	            "dataType": "User",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "User",
		"errorResponses" : [],
		"nickname" : "registerUser"
	},
	'action': function (req,res) {
		if(req.body.email > 0){
			req.db.models.users.create(
				[
					{
						email: req.body.email,
						password: req.body.password
					}
				], function (err, items) {
				    if(err){
				    	res.send(JSON.stringify(err));
				    }else{
				    	res.send(JSON.stringify(items));
				    }
				}
			);
	}
};

var email = {
	'spec': {
		"description" : "Get users email",
		"path" : "/user.{format}/email",
		"notes" : "Get users email",
		"summary" : "Get users email",
		"method": "GET",
		"responseClass" : "string",
		"nickname" : "userEmail"
	},
	'action': function (req,res) {
		if(req.user){
			req.db.models.users.get(req.user, function(err, User){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					res.send(200, JSON.stringify({email: User.email}));
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.post = post;
exports.email = email;