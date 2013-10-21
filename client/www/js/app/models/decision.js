define(
	[
		'backbone',
		'app/config'
	],
	function(
		Backbone,
		cfg
	) {
		var DesisionModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'decision.json',
			idAttribute: 'conference_id',
			defaults:{
				decision: undefined
			}
		});

		DesisionModel.GO = 'go';
		DesisionModel.NOTGO = 'not go';
		DesisionModel.FAVORITE = 'favorite';

		return DesisionModel;
	}
);