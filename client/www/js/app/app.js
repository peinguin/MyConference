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
		
		MyConference.on("initialize:after", function(options){

			var mainLayout = new MainLayout;

			MyConference.mainView.show(mainLayout);
			var headerView = new HeaderView;
			mainLayout.header.show(headerView);

			MyConference.Conferences.start();

			Backbone.history.start();
		});

		return MyConference;
	}
);