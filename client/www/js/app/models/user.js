define(
	[
		'backbone',
		'app/models/localStorage',
		'app/config',
		'app/app',
		'app/views/auth/login_form',
		'app/views/auth/user_info'
	],
	function (
		Backbone,
		Storage,
		cfg,
		MyConference,
		LoginForm
	) {

		var realLogin = function(e){
			e.preventDefault();

			var form = e.target;

			$.ajax({
				url: cfg.baseUrl + 'auth.json',
				data: {
					email: form.email.value,
					password: form.password.value
				},
				method:'POST',
				success :function(user, message, xhr){
					Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
					MyConference.User.set({
						email: user.email,
						isGuest: false
					});
				},
				error: function(xhr){
					if(xhr.status == 403){
						(new AlertView).render(Helper.getErrorStringInHtml(xhr));
					}
				}
			});
		};

		var EmailModel = new (Backbone.Model.extend({
			url: cfg.baseUrl + 'user.json/email'
		}));

		var userModel = Backbone.Model.extend({
			defaults: {
				isGuest: undefined,
				email: undefined
			},
			getEmail: function(){
				var model = this;
				EmailModel.fetch({
					error: function(){
						model.set({
							isGuest: true,
							email: undefined
						})
					},
					success: function(model){
						model.set({
							email: model.get('email'),
							isGuest: false
						});
					}
				});
			},
			initialize: function(){

				var model = this;

				if(Storage.get('API_KEY')){

					var headers = {};
					headers[cfg.authHeader] = Storage.get('API_KEY');

					$.ajaxSetup({headers: headers});
				}

				this.on('change:isGuest change:email', function(){
					if(model.get('isGuest') === false){

					}else{

						var loginForm = new LoginForm;
						loginForm.realLogin = realLogin;

						MyConference.mainView.currentView.header.currentView.auth.show(loginForm);
					}
				})

				this.getEmail();
			},
			logout: function(){
				var model = this;
				$.ajax({
					method:'DELETE',
					dataType: 'html',
					url: cfg.baseUrl + 'auth.json',
					error: function(jqXHR, textStatus, errorThrown){
						console.log(jqXHR, textStatus, errorThrown);
					},
					success: function(){
						Storage.set('API_KEY', undefined);
						model.set({
							isGuest: true,
							email: undefined
						});
					}
				});
			}
		});

		return userModel;
	}
);