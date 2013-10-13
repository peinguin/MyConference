define(
	[
		'marionette',
		'text!app/templates/conferences/decision/logged_in.htt'
	],
	function (Marionette, Template) {
		var ConferenceFullView = Marionette.Layout.extend({
			template: function(model){
				return _.template(Template, model);
			},
			events:{
				
			}
		});

		return ConferenceFullView;
	}
);