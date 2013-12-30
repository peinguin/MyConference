var orm = require('orm');
var config = require('./config');

exports.init = function (app) {
	app.use(orm.express(config.db, {
	    define: function (db, models, next) {

	        db.define("users",
	        	{
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
			        	email: [
			        		orm.enforce.unique("Email already taken!"),
			        		orm.enforce.unique({ ignoreCase: true }),
			            	orm.enforce.notEmptyString()
			            ],
			            password: orm.enforce.notEmptyString()
			        },
			    	id: "id",
			    	autoFetch: false
		    	}
		    );
		    var Conferences = db.define("conferences",
			    {
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
			    },{
			    	id: "id",
			    	autoFetch: false
			    }
		    );
		    var Decisions = db.define("decisions",
			    {
			    	id            : Number,
			    	decision      : ['go', 'not go', 'favorite'],
			    	user          : Number,
			    	conference_id : Number
			    },{
			    	id: "id",
			    	cache: false,
			    	autoFetch: false
			    }
		    );
		    var Streams = db.define("streams",
			    {
			    	id            : Number,
			    	title         : String,
			    	conference_id : Number
			    },{
			    	id: "id",
			    	autoFetch: false
			    }
		    );
		    var Timeslots = db.define("timeslots",
			    {
			    	id        : Number,
			    	time      : String,
			    	speaker   : String,
			    	title     : String,
			    	stream_id : Number
			    },{
			    	id: "id",
			    	autoFetch: false
			    }
		    );

		    Decisions.hasOne('conference', Conferences, {reverse: 'decision'});
		    Streams.hasOne('conference', Conferences, {reverse: 'streams'})
		    Timeslots.hasOne('stream', Streams, {reverse: 'timeslots'});

		    next();
	    }
	}));
}