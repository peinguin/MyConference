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

exports.post = post;