define(
	[
		'backbone',
		'app/config',
	],
	function (
		Backbone,
		cfg
	) {
		var NewUserModel = Backbone.Model.extend({
			defaults: {
				email: undefined,
				password: undefined
			},
			validate: function(attrs, options) {
			    if (attrs.email.length == 0) {
			    //  return "Email must be non-empty";
			    }
			}
		});

		return NewUserModel;
	}
);