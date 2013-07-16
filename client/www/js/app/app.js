define(
	['marionette', 'app/models/user'],
	function (Marionette, UserModel, MyAppRouter){

		var MyConference = new Marionette.Application();

		MyConference.addRegions({
		 	mainView : '#mainView'
		});
		
		MyConference.on("initialize:after", function(options){
			MyConference.User = new UserModel;
			Backbone.history.start();
		});

		return MyConference;
	}
);