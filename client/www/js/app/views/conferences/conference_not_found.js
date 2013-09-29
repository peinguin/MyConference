define(
	[
		'marionette',
		'text!app/templates/conferences/conference_not_found.htt',
	],
	function (
		Marionette,
		ConferenceNotFoundTemplate
	) {
		var ConferenceNotFoundView = Marionette.ItemView.extend({
			template: function(){
				return _.template(ConferenceNotFoundTemplate, {});
			}
		});

		return ConferenceNotFoundView;
	}
);