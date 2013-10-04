define(
	[
		'marionette',
		'text!app/templates/auth/register.htt',
		'app/config',
		'app/helper'
	],
	function (Marionette, Template, cfg, Helper) {

		var hide_problems = function($form){
			$form.find('.help-block').hide();
			$form.find('.form-group').removeClass('has-error');
		}

		var LoginView = Marionette.ItemView.extend({
			template: function(){
				return _.template(Template, {cfg: cfg});
			},
			events:{
				'submit form': 'register'
			},
			register: function(e){
				e.preventDefault();

				var form = e.target;

				var $form = $(form);

				hide_problems($form);

				if(form.password.value == form.password2.value){
					this.model.register(
						{email: form.email.value, password: form.password1.value},
						function(model, xhr, options){Helper.process_errors(JSON.parse(xhr.responseText), $form);}
					);
				}else{
					Helper.process_errors({password2:{message:'Passwords must be equals'}}, $form);
				}
			}
		});

		return LoginView;
	}
);