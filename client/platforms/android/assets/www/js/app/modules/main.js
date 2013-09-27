define(
	[
		'app/app',
		'text!app/templates/layout.htt',
		'app/views/conferences',
		'app/views/header',
		'app/collections/conferences',
		'app/models/conference',
		'app/views/conference_full',
		'app/views/conference_not_found',
		'app/views/spinner'
	],
	function (
		MyConference,
		LayoutTemplte,
		MainView,
		HeaderView,
		ConferencesCollection,
		ConferenceModel,
		ConferenceFullView,
		ConferenceNotFoundView,
		SpinnerView
	) {
		MyConference.module("Main", function(MainModule){
			MainLayout = Backbone.Marionette.Layout.extend({
				template: function(){
					return _.template(LayoutTemplte, {});
				},

				regions: {
			    	header: "header",
			    	content: "#content"
				},

				onShow: function() {
					document.getElementsByTagName('body')[0].className = '';
				}
			});

			var MainController = Backbone.Marionette.Controller.extend(new function(){
				
				var mainLayout = new MainLayout;

				MyConference.mainView.show(mainLayout);
				var headerView = new HeaderView;
				mainLayout.header.show(headerView);

				return {
					main: function(){
						headerView.setHeader('Conferences');

						var conferencesCollection = new ConferencesCollection;

						var spinnerView = new SpinnerView();
						spinnerView.render();
						conferencesCollection.fetch({
							error: function(){
								console.log('error');
							},
							success: function(collection){
								var mainView = new MainView;
								mainView.collection = conferencesCollection;
								mainLayout.content.show(mainView);
								spinnerView.remove();
							}
						})
					},
					conference: function(id){
						var conferenceModel = new ConferenceModel;
						conferenceModel.set('id', id);
						conferenceModel.fetch({
							error: function(){
								var conferenceNotFoundView = new ConferenceNotFoundView;
								mainLayout.content.show(conferenceNotFoundView);
							},
							success: function(conference){
								var conferenceFullView = new ConferenceFullView;
								conferenceFullView.model = conference;
								mainLayout.content.show(conferenceFullView);
							}
						});
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"": "main",
					"conference/:id": "conference",
					"conferences": "main"
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