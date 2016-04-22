var q = require("q");
var pg = require("pg");
var fs = require("fs");
var _exec = require('child_process').exec;
var schema = fs.readFileSync("sql/schema.sql").toString();

var exec = q.denodeify(function(command, callback) {
	console.log(command);
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

module.exports = function(dbname) {
	var url;
	var reset = function() {
		return pgConnect(url)
					.then(function(connection) {
						var client = connection.client;
						var query = q.denodeify(client.query.bind(client));

						return query(schema)
							.finally(connection.done);
					});
	};

	var destroy = function() {
		return exec("dropdb " + dbname);
	};

	var create = function() {
		return exec("createdb " + dbname)
			.catch(function() {
				var username = process.env.USER;
				var cmd = "sudo su - postgres -c \"echo 'create user "+username+"; alter user "+username+" password '\\'"+username+"\\''; alter user "+username+" superuser;' | psql\"";

				return exec(cmd)
					.then(function() {
						return exec("createdb " + dbname);
					})
					.catch(function(e) {
						
					});
			})
			.then(function() {
				var username = process.env.USER;
				url = "postgres://"+username+":"+username+"@localhost/" + dbname

				process.env.DATABASE_URL = url;
			});
	};

	return {
		create: create,
		reset: reset,
		destroy: destroy
	};
};