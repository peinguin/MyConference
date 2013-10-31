exports.header = 'apikey';
exports.memcache = {
	host: '127.0.0.1',
	port: 11211
};

exports.twitter = {
	consumerKey: '',
	consumerSecret: ''
};

exports.facebook = {
	secret: '',
	appID: ''
};

exports.google = {
	id: '',
	secret: ''
};

exports.listen = 8002;
exports.ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
exports.host = 'http://myconference.php.poltava.ua';

exports.db = 'sqlite://'+__dirname+'/db.sqlite';

exports.basePath = 'http://myconference.php.poltava.ua';