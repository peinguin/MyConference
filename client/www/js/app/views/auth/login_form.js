define(
	[
		'marionette',
		'text!app/templates/auth/login.htt',
		'app/config'
	],
	function (Marionette, Template, cfg) {
		var LoginView = Marionette.ItemView.extend({
			controller: undefined,
			realLogin: undefined,
			template: function(){
				return _.template(Template, {cfg: cfg});
			},
			events:{
				'submit form': 'realLogin'
			}
		});

		return LoginView;
	}
);