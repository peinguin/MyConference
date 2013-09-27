define(
	[
		'text!app/templates/conference.htt'
	],
	function (
		ConferenceTemplate
	) {

		ConferenceView = Backbone.Marionette.ItemView.extend({
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

		ConferencesView = Backbone.Marionette.CollectionView.extend({
			itemView: ConferenceView,
			el:'<div class="btn-group-vertical"></div>'
		});

		return ConferencesView;
	}
);