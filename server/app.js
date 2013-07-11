var express = require("express"),
 url = require("url"),
 swagger = require("./swagger"),
 orm = require('./orm');

var app = express();
app.use(express.bodyParser());

orm.init(app);
swagger.init(app);

app.listen(8002);