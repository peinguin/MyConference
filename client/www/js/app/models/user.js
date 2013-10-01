define(
	[
		'backbone',
		'app/models/localStorage',
		'app/config',
		'app/app',
		'app/views/auth/login_form',
		'app/views/auth/user_info',
		'app/views/alert',
		'app/helper'
	],
	function (
		Backbone,
		Storage,
		cfg,
		MyConference,
		LoginForm,
		UserInfo,
		AlertView,
		Helper
	) {
		
		var renew_headers = function(){
			if(Storage.get('API_KEY')){
				var headers = {};
				headers[cfg.authHeader] = Storage.get('API_KEY');
				$.ajaxSetup({headers: headers});
			}
		}

		var EmailModel = new (Backbone.Model.extend({
			url: cfg.baseUrl + 'user.json/email'
		}));

		var userModel = Backbone.Model.extend({
			defaults: {
				isGuest: undefined,
				email: undefined
			},
			getEmail: function(){
				var model = this;
				EmailModel.fetch({
					error: function(){
						model.set({
							isGuest: true,
							email: undefined
						})
					},
					success: function(){
						model.set({
							email: EmailModel.get('email'),
							isGuest: false
						});
					}
				});
			},
			initialize: function(){

				var model = this;

				renew_headers();

				this.on('change:isGuest', function(){
					if(model.get('isGuest') === false){
						var userInfo = new UserInfo({model: model});
						MyConference.mainView.currentView.header.currentView.auth.show(userInfo);
					}else{
						var loginForm = new LoginForm({model: model});
						MyConference.mainView.currentView.header.currentView.auth.show(loginForm);
					}
				})

				this.getEmail();
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
							isGuest: true,
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
					method:'POST',
					success :function(user, message, xhr){
						Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
						model.set({
							email: user.email,
							isGuest: false
						});
						renew_headers();
					},
					error: function(xhr){
						if(xhr.status == 403){
							(new AlertView).render(Helper.getErrorStringInHtml(xhr));
						}
					}
				});
			},
			facebook: function(){

				var afterInit = function(){
					var sendAccessToken = function(response){
				    	$.post(
				    		cfg.baseUrl + 'auth.json/facebook',
				    		{FacebookKEY: response.authResponse.accessToken},
				    		function(data){
				    			console.log(data);
				    		}
				    	);
				    }

					FB.getLoginStatus(function(response) {
						if(response.status == "not_authorized"){
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

				window.onGoogleLoadCallback = function(){
					gapi.auth.authorize(
						{
							client_id:'774864135362.apps.googleusercontent.com',
							scope: 'https://www.googleapis.com/auth/userinfo.email&https://www.googleapis.com/auth/plus.me '
						},
						function(){

						}
					);
				}

				(function() {
					var id = 'google-api-script';
					if (document.getElementById(id)) {return window.onGoogleLoadCallback();}
				    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true; po.id = id;
				    po.src = 'https://apis.google.com/js/plusone.js?onload=onGoogleLoadCallback';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				})();
			},
			twitter: function(){
				window.open(cfg.baseUrl + 'auth.json/twitter', 'twittet Auth', "height=200,width=400");
			},
			linkedin: function(){

				window.onLoadCallback = function(){
					IN.User.authorize(
						function(){
							$.post(
					    		cfg.baseUrl + 'auth.json/linkedin',
					    		{linkedinKEY: IN.ENV.auth.oauth_token},
					    		function(data){
					    			console.log(data);
					    		}
					    	);
						}
					)
				};

				(function(d){
				     var js, id = 'linkedin-jssdk', ref = d.getElementsByTagName('script')[0];
				     if (d.getElementById(id)) {return window.onLoadCallback();}
				     js = d.createElement('script'); js.id = id; js.type = 'text/javascript';js.async = true;
				     js.innerHTML = 
				     	"api_key:5i9vcxh80gl3\n\
				     	authorize: true\n\
				     	onLoad: onLoadCallback";
				     js.src = "http://platform.linkedin.com/in.js";
				     ref.parentNode.insertBefore(js, ref);
				}(document));
			}
		});

		return userModel;
	}
);