define(
	[
		'text!app/templates/conference.htt'
	],
	function (
		ConferenceTemplate,
		ConferencesTemplate
	) {

		ConferenceView = Backbone.Marionette.ItemView.extend({
			template: function(model){
				return _.template(ConferenceTemplate, model);
			}
		});

		ConferencesView = Backbone.Marionette.CollectionView.extend({
			itemView: ConferenceView
		});

		return ConferencesView;
	}
);