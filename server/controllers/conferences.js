var swagger = require("swagger-node-express");

var list = {
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
		req.db.models.conferences.find(5, function(err, conferences){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				res.send(200, JSON.stringify(conferences));
			}
		});
	}
};

var get = {
	'spec': {
		"description" : "Get conference by id",
		"path" : "/conferences.{format}/{id}",
		"notes" : "Get conference",
		"summary" : "Get conference",
		"method": "GET",
		"responseClass" : "conference",
		"nickname" : "conference"
	},
	'action': function (req,res) {

		if (!req.params.id) {
	      throw swagger.errors.invalid('id'); }
	    var id = parseInt(req.params.id);

		req.db.models.conferences.get(id, function(err, conference){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				if(conference){
					if(conference.file){
						conference.file = '/static/' + conference.file;
					}
					res.send(200, JSON.stringify(conference));
				}else{
					throw swagger.errors.notFound('conference');
				}
			}
		});
	}
};

exports.list = list;
exports.get = get;