define(
	[
		'app/app',
		'marionette',
		'text!app/templates/auth/profile.htt',
		'app/config',
		'app/helper'
	],
	function (
		Marionette,
		Template,
		cfg,
		Helper,
		MyConference
	) {
		var LoginView = Marionette.ItemView.extend({
			template: function(model){
				model.cfg = cfg;
				return _.template(Template, model);
			},
			events:{
				'submit form': 'updateInfo',
			},
			onRender: function(){
				var view = this;

				MyConference.once(
					'change:facebook change:twitter change:linkedin change:google',
					function(){
						view.render();
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
			}
		});

		return LoginView;
	}
);