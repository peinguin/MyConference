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
				"click [href=\"#not_implemented\"]": "not_implemented"
			},
			login: function(e){
				e.preventDefault();
				this.model.login(e.target);
			},
			not_implemented: function(e){
				e.preventDefault();
				alert('Not implemented yet');
			}
		});

		return LoginView;
	}
);