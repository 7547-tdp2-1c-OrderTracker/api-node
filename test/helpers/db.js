var q = require("q");
var pg = require("pg");
var fs = require("fs");
var _exec = require('child_process').exec;
var schema = fs.readFileSync("sql/schema.sql").toString();

var exec = q.denodeify(function(command, callback) {
	_exec(command, function(error, stdout, stderr) {
		callback(error, {stdout:stdout, stderr:stderr});
	});
});

var pgConnect = q.denodeify(function(url, callback) {
	pg.connect(url, function(err, client, done) {
		callback(err, {
			client: client,
			done: done
		});
	});
});

module.exports = function(url) {
	var dbname = url.split("/").slice(-1)[0];
	var reset = function() {
		return pgConnect(url)
					.then(function(connection) {
						var client = connection.client;
						var query = q.denodeify(client.query.bind(client));

						return query(schema)
							.finally(connection.done);
					});
	};

	return {
		reset: reset
	};
};