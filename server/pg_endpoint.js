var express = require("express");
var pg = require("pg");
var q = require("q");

var identity = function(obj){return obj; };
module.exports = function(tableName, queryList, queryGet, listWrapper, getWrapper, options) {
	var app = express();
	options = options ||{};

	app.get("/:id", function(req, res) {
		var wrapperInstance;
		if (getWrapper) {
			wrapperInstance = getWrapper(req, res);
		} else {
			wrapperInstance = identity;
		}

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = q.denodeify(client.query.bind(client));
			query(queryGet, [req.params.id]).then(function(result) {
				res.send(wrapperInstance(result.rows[0]));
			}).catch(function(err) {
				console.error(err);
				res.status(500).send('Something broke!');
			}).finally(done);
		});
	});

	app.get("/", function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || options.default_limit || '20');

		var wrapperInstance;
		if (listWrapper) {
			wrapperInstance = listWrapper(req, res);
		} else {
			wrapperInstance = identity;
		}

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = q.denodeify(client.query.bind(client));

			var rows = query(queryList, [offset, limit]);
			var total = query("SELECT COUNT(*) FROM "+tableName);

			q.all([rows, total])
				.spread(function(rows, total) {
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
				}).finally(done);
		});
	});

	return app;
};