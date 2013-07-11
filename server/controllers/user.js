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
		res.send(JSON.stringify(req));
	}
};

exports.post = post;