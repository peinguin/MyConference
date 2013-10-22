var orm = require('orm');

exports.init = function (app) {
	app.use(orm.express('sqlite://'+__dirname+'/db.sqlite', {
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
		        	email: [
		        		orm.enforce.unique("Email already taken!"),
		        		orm.enforce.unique({ ignoreCase: true }),
		            	orm.enforce.notEmptyString()
		            ],
		            password: orm.enforce.notEmptyString()
		        },
		    	id: "id"
		    });
		    var Conferences = db.define("conferences", {
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
		    	id: "id"
		    });
		    var Decisions = db.define("decisions", {
		    	id            : Number,
		    	decision      : ['go', 'not go', 'favorite'],
		    	user          : Number,
		    	conference_id : Number
		    },{
		    	id: "id",
		    	cache: false
		    });
		    var Streams = db.define("streams", {
		    	id            : Number,
		    	title         : String,
		    	conference_id : Number
		    },{
		    	id: "id"
		    });
		    var Timeslots = db.define("timeslots", {
		    	id        : Number,
		    	time      : String,
		    	speaker   : String,
		    	title     : String,
		    	stream_id : Number
		    },{
		    	id: "id"
		    });

		    Decisions.hasOne('conference', Conferences, {reverse: 'decision'});
		    Streams.hasOne('conference', Conferences, {reverse: 'streams'})
		    Timeslots.hasOne('stream', Streams, {reverse: 'timeslots'})
	    }
	}));
}