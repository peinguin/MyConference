define(
	['marionette', 'underscore', 'text!app/templates/login.htt', 'app/config'],
	function (Marionette, _, Template, cfg) {
		var LoginView = Marionette.ItemView.extend({
			controller: undefined,
			template: function(){
				return _.template(Template, {cfg: cfg});
			},
			events:{
				'submit form': 'login'
			},
			login: function(e){
				e.preventDefault();

				this.controller.realLogin(e.target);
			}
		});

		return LoginView;
	}
);