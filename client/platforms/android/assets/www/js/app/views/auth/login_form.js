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
				'click [href=#facebook]': 'facebook',
				'click [href=#twitter]': 'twitter',
				'click [href=#google]': 'google',
				'click [href=#linkedin]': 'linkedin',
			},
			login: function(e){
				e.preventDefault();
				this.model.login(e.target);
			},
			facebook: function(e){
				e.preventDefault();
				this.model.facebook();
			},
			twitter: function(e){
				e.preventDefault();
				this.model.twitter();
			},
			linkedin: function(e){
				e.preventDefault();
				this.model.linkedin();
			},
			google: function(e){
				e.preventDefault();
				this.model.google();
			}
		});

		return LoginView;
	}
);