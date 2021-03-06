define(
	[
		'app/app',
		'marionette',
		'text!app/templates/auth/profile.htt',
		'app/config',
		'app/helper'
	],
	function (
		MyConference,
		Marionette,
		Template,
		cfg,
		Helper
	) {
		var LoginView = Marionette.ItemView.extend({
			template: function(model){
				model.cfg = cfg;
				return _.template(Template, model);
			},
			events:{
				'submit form': 'updateInfo',
				'click [href=#facebook]': 'facebook',
				'click [href=#twitter]': 'twitter',
				'click [href=#google]': 'google',
				'click [href=#linkedin]': 'linkedin',
			},
			onRender: function(){
				var view = this;

				MyConference.Auth.getUser().once(
					'change:facebook change:twitter change:linkedin change:google',
					function(){
						view.render()
					}
				);
			},
			updateInfo: function(e){
				e.preventDefault();

				var $form = $(e.target);

				$form.find('input').attr('disabled', 'disabled');

				var data = {email:e.target.email.value};
				if(e.target.password.value.length > 0){
					data.password = e.target.password.value;
				}

				this.model.save(
					data,
					{
						error:function(model, xhr, options){
							Helper.process_errors(JSON.parse(xhr.responseText), $form);
						},
						success: function(){
							$form.find('input').removeAttr('disabled');
						}
					}
					
				);
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