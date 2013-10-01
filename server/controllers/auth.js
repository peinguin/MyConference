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
		    path: '/v1/people::(~):(id,email)',
		    method: 'GET',
		    headers: {
		        'Content-Type': 'application/json',
		        'oauth_token': req.body.linkedinKEY
		    }
		};
	    var r = require("https").request(options, function(res)
	    {
	        var output = '';
	        console.log(options.host + ':' + res.statusCode);
	        res.setEncoding('utf8');

	        res.on('data', function (chunk) {
	            output += chunk;
	        });

	        res.on('end', function() {
	           // var obj = JSON.parse(output);
	            console.log(res.statusCode, output);
	        });
	    });

	    r.on('error', function(err) {
	        console.log(err)
	    });

	    r.end();

		/**	
			Accept:* /*
			Accept-Encoding:gzip,deflate,sdch
			Accept-Language:uk,en-US;q=0.8,en;q=0.6,ru;q=0.4
			Cache-Control:no-cache
			Connection:keep-alive
			Cookie:bcookie="v=2&2154b6a5-3f82-4532-8910-df8837a151fe"; lidc="b=LB17:g=1:u=1:i=1380611805:t=1380698205:s=1380458451"; __qca=P0-32724600-1380612982582; lang="v=2&lang=en-us"
			Host:api.linkedin.com
			oauth_token:0b90GltkSJiNmTgM46_T1w8upkd1mNHWOGzD
			Pragma:no-cache
			Referer:https://api.linkedin.com/uas/js/xdrpc.html?v=0.0.1190-RC1.30364-1408
			User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36
			X-Cross-Domain-Origin:http://myconference.php.poltava.ua
			X-HTTP-Method-Override:GET
			x-li-format:json
			X-Requested-With:IN.XDCall
		**/
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
exports.twitterCallback = twitterCallback;
exports.google = google;