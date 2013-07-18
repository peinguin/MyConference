define(
	[
		'app/app',
		'text!app/templates/layout.htt',
		'app/views/conferences',
		'app/views/header',
		'app/collections/conferences',
	],
	function (
		MyConference,
		LayoutTemplte,
		MainView,
		HeaderView,
		ConferencesCollection
	) {
		MyConference.module("Main", function(MainModule){
			MainLayout = Backbone.Marionette.Layout.extend({
				template: function(){
					return _.template(LayoutTemplte, {});
				},

				regions: {
			    	header: "header",
			    	content: "#content"
				}
			});

			var MainController = Backbone.Marionette.Controller.extend(new function(){
				
				var mainLayout = new MainLayout;

				MyConference.mainView.show(mainLayout);
				var headerView = new HeaderView;
				mainLayout.header.show(headerView);

				return {
					main: function(){
						headerView.setHeader('conferences');

						var conferencesCollection = new ConferencesCollection;
						conferencesCollection.fetch({
							error: function(){
								console.log('error');
							},
							success: function(collection){
								var mainView = new MainView;
								mainView.collection = collection;
								mainLayout.content.show(mainView);
							}
						})
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"": "main"
				},
				controller: new MainController
			});

			MainModule.addInitializer(function(){
				new MainRouter;
			});

		});

		return MyConference.Main;
	}
);