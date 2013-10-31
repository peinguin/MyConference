define(
	[
		'marionette',

		'text!app/templates/layout.htt',
		'app/views/header',
	],
	function (
		Marionette,

		LayoutTemplte,
		HeaderView
	){

		var MyConference = new Marionette.Application();

		MyConference.addRegions({
		 	mainView : '#mainView'
		});

		var MainLayout = Marionette.Layout.extend({
			template: function(){
				return _.template(LayoutTemplte, {});
			},

			regions: {
		    	header: "header",
		    	content: "#content"
			}
		});

		var mainLayout = undefined;
		
		MyConference.addInitializer(function(options){
			mainLayout = new MainLayout;
			MyConference.mainView.show(mainLayout);
			var headerView = new HeaderView;
			headerView.MyConference = MyConference;
			mainLayout.header.show(headerView);

			MyConference.Conferences.start();
			MyConference.Auth.start();
		});

		MyConference.getMainLayout = function(){
			return mainLayout;
		}

		MyConference.on("initialize:after", function(options){
			Backbone.history.start();
		});

		return MyConference;
	}
);