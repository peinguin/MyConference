define(
	[
		'marionette',
		'text!app/templates/auth/user_info.htt',
	],
	function (Marionette, Template) {
		var LoginView = Marionette.ItemView.extend({
			controller: undefined,
			user: undefined,
			template: function(){
				return _.template(Template);
			}
		});

		return LoginView;
	}
);