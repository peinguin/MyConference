var list = {
	'spec': {
		"description" : "Get streams of conference",
		"path" : "/streams.{format}/{conferenceId}",
		"notes" : "Get streams",
		"summary" : "Get streams",
		"method": "GET",
		"responseClass" : "Set(Stream)",
		"nickname" : "streamsList"
	},
	'action': function (req,res) {
		if (!req.params.conferenceId) {
	      throw swagger.errors.invalid('conferenceId'); }
	    var conferenceId = parseInt(req.params.conferenceId);

	    req.db.models.streams.find({conference_id: conferenceId}, function(err, streams){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				res.send(200, JSON.stringify(streams));
			}
		});
	}
};

var get = {
	'spec': {
		"description" : "Get stream and timeslots",
		"path" : "/stream.{format}/{id}",
		"notes" : "Get stream by id",
		"summary" : "Get stream",
		"method": "GET",
		"responseClass" : "Stream",
		"nickname" : "getStream"
	},
	'action': function (req,res) {
		if (!req.params.id) {
	      throw swagger.errors.invalid('id'); }
	    var id = parseInt(req.params.id);

	    req.db.models.streams.get(id, function(err, stream){
			if(err){
				return res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));}

			if(!stream){
				throw swagger.errors.notFound('stream');}

			stream.getTimeslots(function(err, timeslots){

				if(err){
					return res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));}

				stream.timeslots = timeslots;

				res.send(200, JSON.stringify(stream));
			});
		});
	}
};

exports.list = list;
exports.get = get;