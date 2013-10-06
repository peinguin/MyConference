define(
	[
		'marionette',
		'text!app/templates/header.htt'
	],
	function (
		Marionette,
		template
	) {
		var HeaderView = Marionette.Layout.extend({
			model: {title: undefined, toJSON: function(){return this;}},
			title: undefined,
			MyConference: undefined,
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
				var view = this;
				setTimeout(function(){view.MyConference.Auth.getUser().trigger('renewHeader');}, 1000)
			},
			regions: {
		    	search: "#search",
		    	auth: "#auth"
			}
		});

		return HeaderView;
	}
);