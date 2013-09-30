var cfg = require('./../config');

var post = {
	'spec': {
		"description" : "User auth",
		"path" : "/auth.{format}",
		"notes" : "User auth",
		"summary" : "User auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "User",
	            "description": "User credentials",
	            "dataType": "User",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUser"
	},
	'action': function (req,res) {
		req.db.models.users.find(
			{email: req.body.email||'', password:req.body.password||''},
			function(err, user){
			if(err){
				console.log(err);
				res.send(JSON.stringify(err));
			}else{
				if(user.length != 1){
					res.status(403);
					res.send(JSON.stringify({code: '403', header: 'not found',message: 'User not found'}));
				}else{
					var finded_user = user.pop();
					req.generate_code(function(code){
						req.memcache.set(code, finded_user.id, function(){
							res.header(cfg.header,  code);
							res.send(JSON.stringify(finded_user));
						});
					});
				}
			}
		});
	}
};

var facebook = {
	'spec': {
		"description" : "User facebook auth",
		"path" : "/auth.{format}/facebook",
		"notes" : "User auth",
		"summary" : "User auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "FacebookKEY",
	            "description": "Fasebook API key",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserFacebook"
	},
	'action': function (req,res) {
		
	}
};

var linkedin = {
	'spec': {
		"description" : "User linkedin auth",
		"path" : "/auth.{format}/linkedin",
		"notes" : "User linkedin auth",
		"summary" : "User linkedin auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "linkedinKEY",
	            "description": "Linkedin api keys",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserlinkedin"
	},
	'action': function (req,res) {
	}
};

var twitter = {
	'spec': {
		"description" : "User twitter auth",
		"path" : "/auth.{format}/twitter",
		"notes" : "User twitter auth",
		"summary" : "User twitter auth",
		"method": "GET",
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserTwitter"
	},
	'action': function (req,res) {

		var config = {
		    "consumerKey": cfg.twitter.consumerKey,
		    "consumerSecret": cfg.twitter.consumerSecret,
		    "callBackUrl": cfg.host + twitterCallback.spec.path.replace('{format}', 'json')
		}

		var Twitter = require('twitter-js-client');

		var twitter = new Twitter(config);
		twitter.getUserTimeline();
		twitter.getMentionsTimeline();
		twitter.getHomeTimeline();
		twitter.getReTweetsOfMe();
		twitter.getTweet();
	}
};

var twitterCallback = {
	'spec': {
		"description" : "User twitter auth",
		"path" : "/auth.{format}/twitter",
		"notes" : "User twitter auth",
		"summary" : "User twitter auth",
		"method": "GET",
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserTwitter"
	},
	'action': function (req,res) {

		var config = {
		    "consumerKey": cfg.twitter.consumerKey,
		    "consumerSecret": cfg.twitter.consumerSecret,
		    "callBackUrl": cfg.host + twitter.spec.path.replace('{format}', 'json')
		}

		var Twitter = require('twitter-js-client');

		var twitter = new Twitter(config);
		twitter.getUserTimeline();
		twitter.getMentionsTimeline();
		twitter.getHomeTimeline();
		twitter.getReTweetsOfMe();
		twitter.getTweet();
	}
};

var google = {
	'spec': {
		"description" : "User google auth",
		"path" : "/auth.{format}/google",
		"notes" : "User google auth",
		"summary" : "User google auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "googleKEY",
	            "description": "Google api key",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserGoogle"
	},
	'action': function (req,res) {
	}
};

var del = {
	'spec': {
		"description" : "Logout",
		"path" : "/auth.{format}",
		"notes" : "Logout",
		"summary" : "Logout",
		"method": "DELETE",
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "logoutUser"
	},
	'action': function (req,res) {
		if(req.user){
			req.memcache.delete(req.headers[cfg.header.toLowerCase()], function(){
				res.send(undefined);
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.post = post;
exports.del = del;

exports.facebook = facebook;
exports.linkedin = linkedin;
exports.twitter = twitter;
exports.google = google;