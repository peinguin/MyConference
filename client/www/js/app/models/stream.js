define(
	[
		'backbone',
		'app/config'
	],
	function(
		Backbone,
		cfg
	) {
		var StreamModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'stream.json'
		});

		return StreamModel;
	}
);