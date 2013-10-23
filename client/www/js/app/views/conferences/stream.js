define(
	[
		'marionette',
		'text!app/templates/conferences/stream.htt'
	],
	function (
		Marionette,
		StreamTemplate
	) {

		var StreamView = Backbone.Marionette.ItemView.extend({
			template: function(model){
				return _.template(StreamTemplate, model);
			}
		});

		return StreamView;
	}
);