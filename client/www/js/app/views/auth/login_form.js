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
				"click [href=\"#facebook\"]"       : "facebook",
				"click [href=\"#twitter\"]"        : "twitter",
				"click [href=\"#linkedin\"]"       : "linkedin",
				"click [href=\"#google\"]"         : "google"
			},
			login: function(e){
				e.preventDefault();
				this.model.login(e.target);
			},
			google: function(e){
				e.preventDefault();
				this.model.google();
			},
			twitter: function(e){
				e.preventDefault();
				this.model.twitter();
			},
			linkedin: function(e){
				e.preventDefault();
				this.model.linkedin();
			},
			facebook: function(e){
				e.preventDefault();
				this.model.facebook();
			}
		});

		return LoginView;
	}
);