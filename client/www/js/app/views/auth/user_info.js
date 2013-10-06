define(
	[
		'marionette',
		'text!app/templates/auth/user_info.htt',
	],
	function (Marionette, Template) {
		var LoginView = Marionette.ItemView.extend({
			template: function(model){
				return _.template(Template, model);
			},
			events:{
				"click [href=\"#not_implemented\"]": "not_implemented"
			}
		});

		return LoginView;
	}
);