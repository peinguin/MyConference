define(
	[
		'marionette',
		'text!app/templates/conferences/decision/guest.htt'
	],
	function (Marionette, Template) {
		var ConferenceFullView = Marionette.Layout.extend({
			template: function(model){
				return _.template(Template, model);
			}
		});

		return ConferenceFullView;
	}
);