define(
	[
		'backbone',
		'app/models/localStorage',
		'app/config',
		'app/app',
		'app/views/auth/login_form',
		'app/views/auth/user_info',
		'app/views/alert',
		'app/helper',
		'app/models/new_user'
	],
	function (
		Backbone,
		Storage,
		cfg,
		MyConference,
		LoginForm,
		UserInfo,
		AlertView,
		Helper,
		NewUserModel
	) {
		
		var process_social_resporce = function(model, data, xhr){
			if(data.error){
				(new AlertView).render(Helper.getErrorStringInHtml(xhr));
			}else{
				if(xhr && xhr.getResponseHeader(cfg.authHeader)){
					Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
				}else if(data.header){
					Storage.set('API_KEY', data);
				}
				renew_headers();
				model.fetch();
			}
		}

		var renew_headers = function(){
			if(Storage.get('API_KEY')){
				var headers = {};
				headers[cfg.authHeader] = Storage.get('API_KEY');
				$.ajaxSetup({headers: headers});
			}
		}

		var userModel = NewUserModel.extend({
			defaults: {
				email: undefined,
				twitter: undefined,
				google: undefined,
				facebook: undefined,
				linkedin: undefined
			},
			showHeader: function(){

				var model = this;

				if(model.isNew()){
					if(
						MyConference.mainView.currentView &&
						MyConference.mainView.currentView.header.currentView
					){
						var loginForm = new LoginForm({model: model});
						MyConference.mainView.currentView.header.currentView.auth.show(loginForm);
					}
				}else{
					var userInfo = new UserInfo({model: model});
					MyConference.mainView.currentView.header.currentView.auth.show(userInfo);
				}
			},
			initialize: function(){

				var model = this;

				renew_headers();

				this.on('change:id', function(){
					if(window.location.hash.match(/register/)){
						(new Backbone.Router).navigate("", {trigger: true, replace: true});
					}

					model.showHeader();
				});

				this.on('renewHeader', function(){
					model.showHeader();
				})

				this.fetch({
					error: function(){
						model.trigger('renewHeader');
					}
				});
			},
			logout: function(){
				var model = this;
				$.ajax({
					method:'DELETE',
					dataType: 'html',
					url: cfg.baseUrl + 'auth.json',
					error: function(jqXHR, textStatus, errorThrown){
						console.log(jqXHR, textStatus, errorThrown);
					},
					success: function(){
						Storage.set('API_KEY', undefined);
						model.set({
							id: undefined,
							email: undefined
						});
						renew_headers();
						(new Backbone.Router).navigate("", {trigger: true, replace: true})
					}
				});
			},
			login: function(form){

				var model = this;

				$.ajax({
					url: cfg.baseUrl + 'auth.json',
					data: {
						email: form.email.value,
						password: form.password.value
					},
					dataType: "text",
					method:'POST',
					success :function(user, message, xhr){
						Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
						renew_headers();
						model.fetch();
					},
					error: function(xhr){
						if(xhr.status == 403){
							(new AlertView).render(Helper.getErrorStringInHtml(xhr));
						}
					}
				});
			},
			facebook: function(){

				var model = this;

				var afterInit = function(){
					var sendAccessToken = function(response){
				    	$.post(
				    		cfg.baseUrl + 'auth.json/facebook',
				    		{FacebookKEY: response.authResponse.accessToken},
				    		function(data, message, xhr){
				    			process_social_resporce(model, data, xhr);
				    		}
				    	);
				    }

					FB.getLoginStatus(function(response) {
						if(response.status == "not_authorized" || response.status == "unknown"){
						    FB.login(function(response, a) {
							    if (response.authResponse) {
							    	sendAccessToken(response);
							    } else {
							        console.log(response, a)
							    }
							}, {scope:'email'});
						}else{
							sendAccessToken(response);
						}
					});
				}

				window.fbAsyncInit = function() {
				    FB.init({
				      appId      : '1410429849185535', // App ID
				      status     : true, // check login status
				      cookie     : true, // enable cookies to allow the server to access the session
				      xfbml      : true  // parse XFBML
				    });
				    afterInit();
				};

				// Load the SDK asynchronously
				(function(d){
				     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				     if (d.getElementById(id)) {return afterInit();}
				     js = d.createElement('script'); js.id = id; js.async = true;
				     js.src = "//connect.facebook.net/en_US/all.js";
				     ref.parentNode.insertBefore(js, ref);
				}(document));
			},
			google: function(){

				var model = this;

				window.onGoogleLoad = function(){

					gapi.auth.authorize(
						{
							client_id:'774864135362.apps.googleusercontent.com',
							scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me'
						},
						function(a){
							$.post(
					    		cfg.baseUrl + 'auth.json/google',
					    		{googleKEY: a.access_token},
					    		function(data, message, xhr){
					    			process_social_resporce(model, data, xhr);
					    		}
					    	);
						}
					);
				};

				(function() {
					var id = 'google-api-script';
					if (document.getElementById(id)) { return window.onGoogleLoad();}
				    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true; po.id = id;
				    po.src = 'https://apis.google.com/js/client.js?onload=onGoogleLoad';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				})();
			},
			twitter: function(){
				var model = this;
				var childWin = window.open(cfg.baseUrl + 'auth.json/twitter', 'twittet Auth', "height=640,width=480");
				childWin.onunload = function(){

					var check = function(){
						if(childWin.document){
							var body = childWin.document.getElementsByTagName("body")[0];
							if(body.textContent.length > 0){
								process_social_resporce(model, JSON.parse(body.textContent));
								childWin.close();
							}else{
								setTimeout(check, 100);
							}
						}else{
							setTimeout(check, 100);
						}
					}
					setTimeout(check, 100);
			    }
			},
			linkedin: function(){

				var model = this;

				window.onLinkedinLoad = function(){
					IN.User.authorize(
						function(){
							$.post(
					    		cfg.baseUrl + 'auth.json/linkedin',
					    		{linkedinKEY: IN.ENV.auth.oauth_token},
					    		function(data, message, xhr){
					    			process_social_resporce(model, data, xhr);
					    		}
					    	);
						}
					)
				};

				(function(d){
				     var js, id = 'linkedin-jssdk', ref = d.getElementsByTagName('script')[0];
				     if (d.getElementById(id)) {return window.onLinkedinLoad();}
				     js = d.createElement('script'); js.id = id; js.type = 'text/javascript';js.async = true;
				     js.innerHTML = 
				     	"api_key:5i9vcxh80gl3\n\
				     	authorize: true\n\
				     	onLoad: onLinkedinLoad";
				     js.src = "http://platform.linkedin.com/in.js";
				     ref.parentNode.insertBefore(js, ref);
				}(document));
			},
			setHeader: function(header){
				Storage.set('API_KEY', header);
				renew_headers();
				this.fetch();
			}
		});

		return userModel;
	}
);