var orm = require('orm');

exports.init = function (app) {
	app.use(orm.express('sqlite://'+__dirname+'/db.sqlite', {
	    define: function (db, models) {
	        db.define("users", {
		        id       : Number,
		        email    : String,
		        password : String
		    });
	    }
	}));
}