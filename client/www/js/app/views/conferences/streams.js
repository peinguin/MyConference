define(
	[
		'marionette',
		'text!app/templates/conferences/streams.htt'
	],
	function (
		Marionette,
		StreamsTemplate
	) {

		var StreamsView = Marionette.ItemView.extend({
			conference_id: undefined,
			template: function(model){
				return _.template(StreamsTemplate, model);
			},
			stream: undefined,
			initialize: function(){
				var view = this;

				view.stream = new Backbone.Marionette.Region({
					el: ".stream"
				});
			}
		});

		return StreamsView;
	}
);