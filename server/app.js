var express = require("express"),
 url = require("url"),
 swagger = require("./swagger"),
 orm = require('./orm'),
 auth = require('./auth'),
 config = require('./config');

var app = express();

app.use(express.bodyParser());

auth.init(app);
orm.init(app);
swagger.init(app, express);

app.listen(config.listen);