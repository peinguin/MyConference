define(
	[
		'marionette',
		'text!app/templates/conference_full.htt',
	],
	function (
		Marionette,
		ConferenceFullTemplate
	) {

		var renderOpenStreetMap = function(lat, lng, callback){
	        require(
				['http://openlayers.org/api/OpenLayers.js'],
				function(){
					var map = new OpenLayers.Map();
			        var mapnik         = new OpenLayers.Layer.OSM();
			        var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
			        var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
			        var position       = new OpenLayers.LonLat(lng,lat).transform( fromProjection, toProjection);

			        map.addLayer(mapnik);
			        map.setCenter(position, 8 );

			        callback(map.viewPortDiv);
				}
			);
		}

		var renderGoogleMap = function(lat, lng, callback){

			window.initialize = function(){
					window.initialize = undefined;
					var div=document.createElement("div");

					var mapOptions = {
					    zoom: 8,
					    center: new google.maps.LatLng(lat, lng),
					    mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					map = new google.maps.Map(div, mapOptions);
					div.style.height = '270px';

					callback(div);
				}

			require(
				['https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize'],
				function(){}
			);
		}

		var ConferenceFullView = Marionette.ItemView.extend({
			el:'<div class="conference"></div>',
			template: function(model){
				return _.template(ConferenceFullTemplate, model);
			},
			onRender: function(){

				var view = this;

				if(this.model.get('location')){

					var renderMap = function(map){
						view.$el.find('#map').html(map);
					}

					var location = this.model.get('location');

					var coords = [];

					type = undefined;

					var m = location.match(/\(([0-9\.]+),([0-9\.]+)\)/)
					if(m){
						coords = [m[1], m[2]];
						type = 'google';
					}else{
						var m = location.match(/([\d\.]+)\/([\d\.]+)\/([\d\.]+)/)
						if(m){
							coords = [m[2], m[3]];
							type = 'open';
						}
					}

					if(type){
						if(type == 'google'){
							renderGoogleMap(coords[0], m[1], renderMap);
						}else{
							renderOpenStreetMap(coords[0], m[1], renderMap);
						}						
					}else{
						console.log('error. Uknown map format');
					}
				}

				if(this.model.get('file')){
					var file = this.model.get('file');

					if(file.match(/\.(gif|png|jpg|jpeg)$/)){
						view.$el.find('#file').html('<img src="'+file+'" />');
					}else if(file.match(/\.(pdf)$/)){
						require(
							['pdf'],
							function(){
								PDFJS.workerSrc = 'js/lib/pdf.worker.js';
								PDFJS.getDocument(file).then(function(pdf) {
								  // Using promise to fetch the page
								  pdf.getPage(1).then(function(page) {
								    var scale = 1.5;
								    var viewport = page.getViewport(scale);

								    //
								    // Prepare canvas using PDF page dimensions
								    //
								    var canvas = document.createElement("canvas");
								    var context = canvas.getContext('2d');
								    canvas.height = viewport.height;
								    canvas.width = viewport.width;

								    //
								    // Render PDF page into canvas context
								    //
								    var renderContext = {
								      canvasContext: context,
								      viewport: viewport
								    };
								    page.render(renderContext);

								    view.$el.find('#file').append(canvas);
								  });
								});
							}
						);
					}else{
						view.$el.find('#file').html('<a href="'+file+'" >File</a>');
					}
				}
			}
		});

		return ConferenceFullView;
	}
);