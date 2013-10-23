define(
	[
		'marionette',
		'text!app/templates/conferences/search_form.htt',
	],
	function (
		Marionette,
		Template
	) {

		var SearchView = Marionette.ItemView.extend({
			el:'<form role="search" class="navbar-form navbar-left"></form>',
			template: function(model){
				return _.template(Template, model);
			},
			events:{
				"submit":"not_implemented"
			},
			not_implemented: function(e){
				e.preventDefault();
				alert('Not implemented');
			}
		});

		return SearchView;
	}
);