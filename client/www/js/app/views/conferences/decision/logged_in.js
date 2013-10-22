define(
	[
		'marionette',
		'text!app/templates/conferences/decision/logged_in.htt',
		'app/models/decision'
	],
	function (Marionette, Template, DecisionModel) {
		var LoggedInDecisionView = Marionette.Layout.extend({
			template: function(model){
				return _.template(Template, model);
			},
			parent: undefined,
			events:{
				"click .btn-success": 'go',
				"click .btn-danger": 'not go',
				"click .btn-info": 'favorite'
			},
			decision: function(decision, el){

				var view = this;

				if(!view.model.isNew() && view.model.get('decision') == decision){
					view.model.destroy({
						error: function(m, r, t){
							console.log('error',m, r, t);
						},
						success: function(){
							$(el).removeClass('glyphicon glyphicon-ok');
							view.model = new DecisionModel();
						}
					});
				}else{
					view.model.set({conference_id: undefined});
					view.model.url = view.model.urlRoot + '/' + view.parent.getConference();
					view.model.save({decision: decision}, {
						error: function(m, r, t){
							console.log('error',m, r, t);
						},
						success: function(){
							view.$el.find('.btn').removeClass('glyphicon glyphicon-ok');
							$(el).addClass('glyphicon glyphicon-ok');
						}
					});
				}
			},
			go: function(e){
				e.preventDefault();
				this.decision(DecisionModel.GO, e.target);
			},
			favorite: function(e){
				e.preventDefault();
				this.decision(DecisionModel.FAVORITE, e.target);
			},
			'not go': function(e){
				e.preventDefault();
				this.decision(DecisionModel.NOTGO, e.target);
			}
		});

		return LoggedInDecisionView;
	}
);