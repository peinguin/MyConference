var orm = require('orm');

var opts = {
  database : "test",
  protocol : "mysql",
  host     : "127.0.0.1",
  port     : 3306,
  user     : 'root',
  password : 'mysql',
  query    : {
    pool     : false,
    debug    : false,
    strdates : false
  }
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