var orm = require('orm');

exports.init = function (app) {console.log('sqlite://'+__dirname+'/db.sqlite');
	app.use(orm.express('sqlite:/'+__dirname+'/db.sqlite', {
	    define: function (db, models) {
	        db.define("users", {
		        id       : Number,
		        email    : String,
		        password : String
		    });
		    db.define("conferences", {
		        id       : Number,
		        name    : String
		    });
	    }
	}));
}