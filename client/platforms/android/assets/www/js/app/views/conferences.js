define(
	[
		'text!app/templates/conference.htt',
		'text!app/templates/conferences.htt'
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

		ConferencesView = Backbone.Marionette.CompositeView.extend({
			itemView: ConferenceView,
			template: function(model){
				return _.template(ConferencesTemplate, model);
			}
		});

		return ConferencesView;
	}
);