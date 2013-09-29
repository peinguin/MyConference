define(
	[
		'marionette',

		'app/app',
		'app/views/conferences/conferences',
		'app/collections/conferences',
		'app/models/conference',
		'app/views/conferences/conference_full',
		'app/views/conferences/conference_not_found',
		'app/views/spinner',
		'app/views/conferences/search'
	],
	function (
		Marionette,
		MyConference,
		MainView,
		ConferencesCollection,
		ConferenceModel,
		ConferenceFullView,
		ConferenceNotFoundView,
		SpinnerView,
		SearchView
	) {
		MyConference.module("Conferences", function(MainModule){
			
			var ConferencesController = Marionette.Controller.extend(new function(){
				return {
					main: function(){
						MyConference.mainView.currentView.header.currentView.setHeader('Conferences');

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
								MyConference.mainView.currentView.content.show(mainView);
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
								MyConference.mainView.currentView.content.show(conferenceNotFoundView);
							},
							success: function(conference){
								var conferenceFullView = new ConferenceFullView;
								conferenceFullView.model = conference;
								MyConference.mainView.currentView.content.show(conferenceFullView);
							}
						});
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"conference/:id": "conference",
					"conferences": "main",
					"": "main"
				},
				controller: new ConferencesController
			});

			MainModule.addInitializer(function(){
				new MainRouter;
			});

			this.startWithParent = false;

			MainModule.on("start", function(){
				var searchView = new SearchView;
				MyConference.mainView.currentView.header.currentView.search.show(searchView);
			});

		});

		return MyConference.Main;
	}
);