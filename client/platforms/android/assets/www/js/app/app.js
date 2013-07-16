define(
	['marionette', 'app/views/layout'],
	function (Marionette, LayoutView){

		var MyConference = new Marionette.Application();

		MyConference.addRegions({
		 	mainView : '#mainView'
		});

		MyConference.addInitializer(function(options){
            var LayoutView = new LayoutView();
            MyConference.mainView.show(LayoutView);
		});

		MyConference.addInitializer(function(options){
			Backbone.history.start();
		});

		MyConference.on('initialize:after', function(){
			console.log('initialize:after')
		});

		return MyConference;
	}
);