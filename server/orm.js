var orm = require('orm');

exports.init = function (app) {
	app.use(orm.express("sqlite:///db.sqlite", {
	    define: function (db, models) {
	    	console.log(db)
	    	console.log(models)
	        //models.person = db.define("person", { ... });

	        var fulltxt = db.define("fulltxt", {
		        id      : Number,
		        fulltxt   : String
		    });

		   /*fulltxt.get(1, function(err, fulltxt) {
			    console.log( fulltxt.fulltxt );
			})*/
	    }
	}))
}