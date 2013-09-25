define(
	[
		'marionette',
		'text!app/templates/conference_full.htt',
	],
	function (
		Marionette,
		ConferenceFullTemplate
	) {
		var ConferenceFullView = Marionette.ItemView.extend({
			template: function(model){
				return _.template(ConferenceFullTemplate, model);
			}
		});

		return ConferenceFullView;
	}
);