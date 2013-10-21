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
					if(req.user){
						conference.getDecision({user: req.user}, function(err, decision){
							if(err){
								res.send(500, JSON.stringify(err));
							}else{
								conference.decision = decision.pop();
								res.send(200, JSON.stringify(conference));
							}
						});
					}else{
						res.send(200, JSON.stringify(conference));
					}
				}else{
					throw swagger.errors.notFound('conference');
				}
			}
		});
	}
};

var decision = {
	'spec': {
		"description" : "Make decision about conference",
		"path" : "/decision.{format}/{conferenceId}",
		"notes" : "Conference decision",
		"summary" : "Conference decision",
		"method": "POST",
		"responseClass" : "string",
		"nickname" : "conferenceDecison",
		"parameters":[
          {
            "paramType": "body",
            "name": "Decision",
            "description": "Conference decision",
            "dataType": "string",
            "required": true,
            "allowMultiple": false
          },
          {
          	"paramType": "path",
          	"name": "conferenceId",
          	"decision":"Id of conference",
          	"dataType": "integer",
          	"required": true
          }
        ]
	},
	'action': function (req,res) {

		var conferenceId = parseInt(req.params.conferenceId);
		if (!conferenceId) {
	      throw swagger.errors.invalid('conferenceId'); }
	    
		if(req.user){
			req.db.models.decisions.find({conference_id: conferenceId, user: req.user}, function(err, decisions){
				if(decisions && decisions.length > 0){
					var decision = decisions.pop();
					decision.decision = req.body.decision;
					decision.save(function(err){
						if(err){
							res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
						}else{
							res.send(200, JSON.stringify(decision));
						}
					});
				}else{
					req.db.models.decisions.create([{
						user: req.user,
						conference_id: conferenceId,
						decision: req.body.decision
					}], function(err, items){
						if(err){
							res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
						}else{
							res.send(200, JSON.stringify(items.pop()));
						}
					});
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

var reject = {
	'spec': {
		"description" : "Reject conference decision",
		"path" : "/decision.{format}/{conferenceId}",
		"notes" : "Reject decision",
		"summary" : "Reject decision",
		"method": "POST",
		"responseClass" : "string",
		"nickname" : "rejectDecision",
		"parameters":[
          {
            "paramType": "path",
            "name": "conferenceId",
            "description": "Conference id",
            "dataType": "int",
            "required": true
          }
        ]
	},
	'action': function (req,res) {
		var conferenceId = parseInt(req.params.conferenceId);
		if (!conferenceId) {
	      throw swagger.errors.invalid('conferenceId'); }
	    
		if(req.user){
			req.db.models.decisions.find({conference_id: conferenceId, user: req.user}, function(err, decisions){
				if(decisions && decisions.length > 0){
					var decision = decisions.pop();
				}else{
					res.send(404);
				}
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					decision.remove(function(err){
						if(err){
							res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
						}else{
							res.send(200, {status: 'OK'});
						}
					});
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.list = list;
exports.get = get;

exports.decision = decision;
exports.reject = reject;