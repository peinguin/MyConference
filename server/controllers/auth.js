var cfg = require('./../config'),
	url = require("url");

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
		var FB = new (require('facebook-node-sdk'))({ appId: cfg.facebook.appID, secret: cfg.facebook.secret });

		FB.setAccessToken(req.body.FacebookKEY);

		FB.api('/me', function(err, data) {
			connect_by('facebook', JSON.parse(body).id, req, res);
		});
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

		var options = {
		    host: 'api.linkedin.com',
		    port: 443,
		    path: '/v1/people::(~):(id,email-address)',
		    method: 'GET',
		    headers: {
		        'Content-Type': 'application/json',
		        'oauth_token': req.body.linkedinKEY,
		        'x-li-format':'json'
		    }
		};
	    var r = require("https").request(options, function(res)
	    {
	        var output = '';
	        res.setEncoding('utf8');

	        res.on('data', function (chunk) {
	            output += chunk;
	        });

	        res.on('end', function() {
	            connect_by('linkedin', JSON.parse(output).vaues[0].id, req, res);
	        });
	    });

	    r.end();
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

		var Twitter = require('twitter-js-client').Twitter;
		var twitter = new Twitter(config);
		twitter.getOAuthRequestToken(function(oauth){
			req.memcache.set(oauth.token, oauth.token_secret, function(){
				res.writeHead(302, {
			  	'Location': 'https://api.twitter.com/oauth/authenticate?oauth_token='+oauth.token
				});
				res.end();
			});
		});
	}
};

var twitterCallback = {
	'spec': {
		"description" : "User twitter auth callback",
		"path" : "/auth.{format}/twitter_callback",
		"notes" : "User twitter auth callback",
		"summary" : "User twitter auth callback",
		"method": "GET",
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserTwitterCallback"
	},
	'action': function (req,res) {

		var url = require('url');
		var url_parts = url.parse(req.url, true);

		req.memcache.get(url_parts.query.oauth_token, function(err, token_secret){
			var config = {
			    "consumerKey": cfg.twitter.consumerKey,
			    "consumerSecret": cfg.twitter.consumerSecret,
			    "callBackUrl": cfg.host + twitterCallback.spec.path.replace('{format}', 'json')
			};

			var Twitter = require('twitter-js-client').Twitter;

			var twitter = new Twitter(config);

			twitter.getOAuthAccessToken(
				{
					token: url_parts.query.oauth_token,
					token_secret: token_secret,
					verifier: url_parts.query.oauth_verifier
				},
				function(oauth){

					if(oauth.access_token){

						var config = {
						    "consumerKey": cfg.twitter.consumerKey,
						    "consumerSecret": cfg.twitter.consumerSecret,
						    "accessToken": oauth.access_token,
						    "accessTokenSecret": oauth.access_token_secret,
						    "callBackUrl": cfg.host + twitterCallback.spec.path.replace('{format}', 'json')
						};

						var twitter = new Twitter(config);

						twitter.doRequest(
							twitter.baseUrl + '/account/verify_credentials.json',
							function(err, response, body){
								console.log(err, body);
							},
							function(body){
								connect_by('twitter', JSON.parse(body).id, req, res);
							}
						);
					}else{
						console.log(oauth);
						res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(oauth)}));
					}
				}
			);
		});
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
		var googleapis = require('googleapis'),
		    OAuth2Client = googleapis.OAuth2Client;

		var oauth2Client = new OAuth2Client(cfg.google.id, cfg.google.secret);
console.log(oauth2Client.credentials)
		oauth2Client.credentials = {
		  access_token: req.body.googleKEY
		};
console.log(oauth2Client.credentials)
		googleapis
		  .discover('plus', 'v1')
		  .execute(function(err, client) {

			client
			  .plus.people.get({ userId: 'me' })
			  .withAuthClient(oauth2Client)
			  .execute(function(a/*, b, c*/){
			  	console.log(a/*, b, c*/)
			  });
		});
	}
}

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
exports.twitterCallback = twitterCallback;
exports.google = google;