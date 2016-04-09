var express = require("express");
var pg = require("pg");
var q = require("q");

var identity = function(obj){return obj; };
module.exports = function(tableName, wrapper) {
	var app = express();

	app.get("/", function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || '20');

		var wrapperInstance;
		if (wrapper) {
			wrapperInstance = wrapper(req, res);
		} else {
			wrapperInstance = identity;
		}

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = q.denodeify(client.query.bind(client));
			var rows = query("SELECT * FROM "+tableName+" OFFSET $1::int LIMIT $2::int", [offset, limit]);
			var total = query("SELECT COUNT(*) FROM "+tableName);

			q.all([rows, total])
				.spread(function(rows, total) {
					done();
					res.send({
						paging: {
							limit: limit,
							offset: offset,
							total: total.rows[0].count
						},
						results: rows.rows.map(wrapperInstance)
					});

				})
				.catch(function(err) {
					console.error(err);
					res.status(500).send('Something broke!');
				});
		});
	});

	return app;
};