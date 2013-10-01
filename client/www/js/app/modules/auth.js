define(
	[
		'app/app',
		'marionette',
		'app/models/user'
	],
	function(
		MyConference,
		Marionette,
		UserModel
	){

		MyConference.module("Auth", function(AuthModule){

			var User = new UserModel;

			var AuthController = Marionette.Controller.extend({
				register: function(){

					if(User.get('isGuest') === false){
						return (new Backbone.Router).navigate("", {trigger: true, replace: true});
					}

					var registerView = new RegisterView;
					registerView.controller = this;
					MyConference.mainView.show(registerView);
				},
				logout: function(){
					if(User.get('isGuest') === true){
						return (new Backbone.Router).navigate("", {trigger: true, replace: true});
					}else{
						User.logout();
					}
				}
			});

			var AuthRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"register": "register",
					"logout": "logout"
				},
				controller: new AuthController
			});

			AuthModule.addInitializer(function(){
				new AuthRouter;
			});

			this.getUser = function(){
				return User;
			}

			this.startWithParent = false;

		});

		return MyConference.Auth;
	}
);