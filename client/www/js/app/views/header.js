define(
	[
		'marionette', 'text!app/templates/header.htt',
		'app/app'
	],
	function (
		Marionette,
		template,
		MyConference
	) {
		var HeaderView = Marionette.Layout.extend({
			model: {title: undefined, toJSON: function(){return this;}},
			title: undefined,
			setHeader: function(title){
				if(!this.title){
					this.title = this.$el.find('#title');
				}
				this.title.text(title);
			},
			template: function(data){
				return _.template(template, {title: data.title});
			},

			onRender: function(){
				if(MyConference.Auth && MyConference.Auth.getUser()){
					MyConference.Auth.getUser().showHeader();
				}
			},

			regions: {
		    	search: "#search",
		    	auth: "#auth"
			}
		});

		return HeaderView;
	}
);