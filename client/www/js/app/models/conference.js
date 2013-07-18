define(
	[
		'app/config'
	],
	function(
		cfg
	) {
		var ConferenceModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + '/conference.json'
		});

		return ConferenceModel;
	}
);