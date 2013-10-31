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
		'app/views/conferences/search',
		'app/collections/streams',
		'app/views/conferences/streams',
		'app/models/stream',
		'app/views/conferences/stream',
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
		SearchView,
		StreamsCollection,
		StreamsView,
		StreamModel,
		StreamView
	) {
		MyConference.module("Conferences", function(MainModule){

			var ShowStream = function(id){

				var streamModel = new StreamModel({id: id});
				streamModel.fetch({
					error: function(){console.log('error');},
					success: function(stream){
						if(
							MyConference.mainView.currentView.content.currentView &&
							MyConference.mainView.currentView.content.currentView.stream
						){
							var streamView = new StreamView;
							streamView.model = stream;

							var $ul = MyConference.mainView.currentView.content.currentView.$el.children('ul.nav.nav-tabs');
							$ul.children().removeClass('active');
							$ul.children('[data-id='+id+']').addClass('active');

							MyConference.mainView.currentView.content.currentView.stream.show(streamView);
						}else{
							ShowStreams(stream.get('conference_id'), function(){ShowStream(id);});
						}
					}
				});
			}

			var ShowStreams = function(id, callback){
				var streamsCollection = new StreamsCollection(id);
				streamsCollection.fetch({
					error: function(){console.log('error');},
					success: function(streams){
						var streamsView = new StreamsView;
						streamsView.model = {
							conference_id:id,
							streams: streams,
							toJSON:function(){return this;}
						};
						MyConference.mainView.currentView.content.show(streamsView);

						if(callback){
							callback(streams);
						}
					}
				});
			}
			
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
					},
					streams: function(conference_id){
						ShowStreams(
							conference_id,
							function(streams){
								ShowStream(streams.at(0).get('id'));
							}
						);
					},
					stream: function(id){
						ShowStream(id);
					}
				}
			});

			var MainRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"conference/:id": "conference",
					"conferences": "main",
					"": "main",
					"streams/:conference_id": "streams",
					"stream/:id": "stream"
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