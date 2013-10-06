define(
	[
		'marionette',
		'text!app/templates/auth/login.htt',
		'app/config'
	],
	function (Marionette, Template, cfg) {
		var LoginView = Marionette.ItemView.extend({
			template: function(){
				return _.template(Template, {cfg: cfg});
			},
			events:{
				'submit form': 'login',
			},
			login: function(e){
				e.preventDefault();
				this.model.login(e.target);
			}
		});

		return LoginView;
	}
);