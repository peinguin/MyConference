define(
	[
		'app/app',
		'marionette',
		'app/views/login',
		'app/config',
		'app/helper',
		'app/views/alert',
		'app/models/localStorage'
	],
	function(
		MyConference,
		Marionette,
		LoginView,
		cfg,
		Helper,
		AlertView,
		Storage
	){

		MyConference.module("Auth", function(AuthModule){

			var AuthController = Marionette.Controller.extend({
				login: function(){
					var loginView = new LoginView;
					loginView.controller = this;
					MyConference.mainView.show(loginView);
				},
				logout: function(){
					MyConference.User.logout();
				},
				realLogin: function(form){
					$.ajax({
						url: cfg.baseUrl + 'auth.json',
						data: {
							email: form.email.value,
							password: form.password.value
						},
						method:'POST',
						success :function(user, message, xhr){
							Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
							MyConference.User.set({
								email: user.email,
								isGuest: false
							});
						},
						error: function(xhr){
							if(xhr.status == 403){
								(new AlertView).render(Helper.getErrorStringInHtml(xhr));
							}
						}
					});
				}
			});

			var AuthRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"login": "login",
					"logout": "logout"
				},
				controller: new AuthController
			});

			AuthModule.addInitializer(function(){
				new AuthRouter;
			});

		});

		return MyConference.Auth;
	}
);