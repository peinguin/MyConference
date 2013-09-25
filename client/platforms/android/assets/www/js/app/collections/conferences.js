define(
	[
		'app/models/conference',
		'app/config'
	],
	function (
		ConferenceModel,
		cfg
	) {
		var ConferencesCollection = Backbone.Collection.extend({
			model: ConferenceModel,
			url: cfg.baseUrl + 'conferences.json'
		});

		return ConferencesCollection;
	}
);