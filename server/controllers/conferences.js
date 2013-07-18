var get = {
	'spec': {
		"description" : "Get conferences",
		"path" : "/conferences.{format}",
		"notes" : "Get conferences",
		"summary" : "Get conferences",
		"method": "GET",
		"responseClass" : "Set(conferences)",
		"nickname" : "conferencesList"
	},
	'action': function (req,res) {
		if(req.user){
			req.db.models.conferences.find(5, function(err, conferences){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					res.send(200, JSON.stringify(conferences));
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.get = get;