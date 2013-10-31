define(
	[
		'backbone',
		'app/config'
	],
	function(
		Backbone,
		cfg
	) {
		var ConferenceModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'conferences.json'
		});

		return ConferenceModel;
	}
);