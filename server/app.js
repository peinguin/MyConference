var express = require("express"),
 swagger = require("./swagger"),
 orm = require('./orm'),
 auth = require('./auth'),
 config = require('./config'),
 static_files = require('./static');

var app = express();

app.use(express.bodyParser());
res.send(200, 'sqlite://'+__dirname+'/db.sqlite');res.end();
auth.init(app);
orm.init(app);
swagger(app);
static_files(app);

app.listen(config.listen);