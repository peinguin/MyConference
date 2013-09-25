define(
	[
		'app/config'
	],
	function(
		cfg
	) {
		var ConferenceModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'conferences.json'
		});

		return ConferenceModel;
	}
);