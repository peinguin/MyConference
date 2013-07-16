define(
	['backbone', 'app/models/localStorage', 'app/config', 'app/app', 'app/views/header'],
	function (Backbone, Storage, cfg, MyConference, HeaderView) {

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

				this.on('change:isGuest change:email',function(){
					if(model.get('isGuest') === true){
						(new Backbone.Router).navigate("login", {trigger: true, replace: true});
					}
				});

				this.getEmail();
			},
			logout: function(){
				var model = this;
				$.ajax({
					method:'DELETE',
					url: cfg.baseUrl + 'auth.json',
					error: function(){console.log('error')},
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