define(
	[
		'marionette',
		'text!app/templates/conferences/conference.htt'
	],
	function (
		Marionette,
		ConferenceTemplate
	) {

		var ConferenceView = Marionette.ItemView.extend({
			template: function(model){
				return _.template(ConferenceTemplate, model);
			},
			onRender: function () {
		      // get rid of that pesky wrapping-div
		      // assumes 1 child element.
		      this.$el = this.$el.children();
		      this.setElement(this.$el);
		    }
		});

		ConferencesView = Marionette.CollectionView.extend({
			itemView: ConferenceView,
			el:'<div class="btn-group-vertical"></div>'
		});

		return ConferencesView;
	}
);