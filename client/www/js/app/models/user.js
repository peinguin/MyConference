define(
	[
		'backbone',
		'app/models/localStorage',
		'app/config',
		'app/app',
		'app/views/auth/login_form',
		'app/views/auth/user_info',
		'app/views/alert',
		'app/helper'
	],
	function (
		Backbone,
		Storage,
		cfg,
		MyConference,
		LoginForm,
		UserInfo,
		AlertView,
		Helper
	) {
		
		var renew_headers = function(){
			if(Storage.get('API_KEY')){
				var headers = {};
				headers[cfg.authHeader] = Storage.get('API_KEY');
				$.ajaxSetup({headers: headers});
			}
		}

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
					success: function(){
						model.set({
							email: EmailModel.get('email'),
							isGuest: false
						});
					}
				});
			},
			initialize: function(){

				var model = this;

				renew_headers();

				this.on('change:isGuest', function(){
					if(model.get('isGuest') === false){
						var userInfo = new UserInfo({model: model});
						MyConference.mainView.currentView.header.currentView.auth.show(userInfo);
					}else{
						var loginForm = new LoginForm({model: model});
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
						renew_headers();
						(new Backbone.Router).navigate("", {trigger: true, replace: true})
					}
				});
			},
			login: function(form){

				var model = this;

				$.ajax({
					url: cfg.baseUrl + 'auth.json',
					data: {
						email: form.email.value,
						password: form.password.value
					},
					method:'POST',
					success :function(user, message, xhr){
						Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
						model.set({
							email: user.email,
							isGuest: false
						});
						renew_headers();
					},
					error: function(xhr){
						if(xhr.status == 403){
							(new AlertView).render(Helper.getErrorStringInHtml(xhr));
						}
					}
				});
			}
		});

		return userModel;
	}
);