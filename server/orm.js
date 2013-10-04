var orm = require('orm');

exports.init = function (app) {
	app.use(orm.express('sqlite:///srv/node/MyConference/server/db.sqlite', {
	    define: function (db, models) {
	        db.define("users", {
		        id       : Number,
		        email    : String,
		        password : String,
		        twitter  : Number,
		        facebook : Number,
		        google   : Number,
		        linkedin : String
		    },
		    {
		        validations: {
		        	email: orm.enforce.unique("Email already taken!"),
		        	email: orm.enforce.unique({ ignoreCase: true }),
		            email: orm.enforce.notEmptyString()
		        }
		    });
		    db.define("conferences", {
		        id          : Number,
		        title       : String,
		        description : String,
		        datetime    : Date,
		        place       : String,
		        location    : String,
		        site        : String,
		        logo        : String,
		        facebook    : String,
		        twitter     : String,
		        telephone   : String,
		        cost        : String,
		        file        : String
		    });
	    }
	}));
}