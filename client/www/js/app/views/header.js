define(
	[
		'marionette'
	],
	function (
		Marionette
	) {
		var HeaderView = Marionette.ItemView.extend({
			model: {title: undefined, toJSON: function(){return this;}},
			title: undefined,
			setHeader: function(title){
				this.model.title = title;
				this.render();
			},
			template: function(data){
				return _.template('<%= title %>', {title: data.title});
			}
		});

		return HeaderView;
	}
);