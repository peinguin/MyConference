var orm = require('orm');

var opts = {
  database : "db.sqlite",
  protocol : "sqlite"
};

exports.init = function (app) {
	app.use(orm.express(opts, {
	    define: function (db, models) {
	    	console.log(db)
	    	console.log(models)
	        //models.person = db.define("person", { ... });

	        var fulltxt = db.define("fulltxt", {
		        id      : Number,
		        fulltxt   : String
		    });

		    fulltxt.get(1, function(err, fulltxt) {
			    console.log( fulltxt.fulltxt );
			})
	    }
	}))
}