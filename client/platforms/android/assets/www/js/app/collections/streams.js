define(
	[
		'app/models/stream',
		'app/config'
	],
	function (
		StreamModel,
		cfg
	) {

		var baseUrl = cfg.baseUrl + 'streams.json/';

		var StreamsCollection = Backbone.Collection.extend({
			model: StreamModel,
			initialize: function(conference_id){
				this.url = baseUrl + conference_id;
			}
		});

		return StreamsCollection;
	}
);