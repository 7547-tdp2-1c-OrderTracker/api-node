var express = require("express");
var pg = require("pg");
var q = require("q");

var identity = function(obj){return obj; };

module.exports = function(tableName, queryList, queryCount, queryGet, listWrapper, getWrapper, options) {
	var app = express();
	options = options ||{};

	var pgConnect = q.denodeify(function(url, callback) {
		pg.connect(url, function(err, client, done) {
			callback(err, {
				client: client,
				done: done
			});
		});
	});

	app.delete("/:id", function(req, res) {
		pgConnect(process.env.DATABASE_URL).then(function(connection) {
			var client = connection.client;
			var query = q.denodeify(client.query.bind(client));
			return query("DELETE FROM " + tableName + " WHERE id = $1::int", [req.params.id])
				.finally(connection.done);
		})
			.then(function() {
				res.sendStatus(204);
			}).catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
			});
	});

	if (options.fields) {
		app.post("/", function(req, res) {
			pgConnect(process.env.DATABASE_URL).then(function(connection) {
				var currentFields = options.fields.filter(function(fieldName) {
					return typeof req.body[fieldName] !== "undefined";
				});

				var queryText = "INSERT INTO " + tableName + " (" + currentFields.join(",") + ") VALUES (" + currentFields.map(function(fieldName, index) {
					return "$"+(index+1);
				}).join(",") + ")";

				var client = connection.client;
				var query = q.denodeify(client.query.bind(client));
				return query(queryText, currentFields.map(function(fieldName){
					return req.body[fieldName];
				}))
					.finally(connection.done);
			})
				.then(function() {
					res.sendStatus(204);
				}).catch(function(err) {
					console.error(err);
					res.status(500).send(err.toString());
				});
		});	

		app.put("/:id", function(req, res) {
			pgConnect(process.env.DATABASE_URL).then(function(connection) {
				var currentFields = options.fields.filter(function(fieldName) {
					return typeof req.body[fieldName] !== "undefined";
				});

				var queryText = "UPDATE " + tableName + " SET " + currentFields.map(function(fieldName, index) {
					return fieldName + "=$"+(index+2);
				}).join(",") + " WHERE id = $1::int";

				var client = connection.client;
				var query = q.denodeify(client.query.bind(client));
				var queryParams = [req.params.id].concat(currentFields.map(function(fieldName){
					return req.body[fieldName];
				}));
				
				return query(queryText, queryParams)
					.finally(connection.done)
			})
				.then(function() {
					res.sendStatus(204);
				}).catch(function(err) {
					console.error(err);
					res.status(500).send(err.toString());
				});
		});	

	}

	app.get("/:id", function(req, res) {
		var wrapperInstance;
		if (getWrapper) {
			wrapperInstance = getWrapper(req, res);
		} else {
			wrapperInstance = identity;
		}

		pgConnect(process.env.DATABASE_URL).then(function(connection) {
			var client = connection.client;
			var query = q.denodeify(client.query.bind(client));
			return query(queryGet, [req.params.id])
				.finally(connection.done);
		}).then(function(result) {
				res.send(wrapperInstance(result.rows[0]));
			}).catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
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

		pgConnect(process.env.DATABASE_URL).then(function(connection) {
			var client = connection.client;
			var query = q.denodeify(client.query.bind(client));

			var rows = queryList(query, req, offset, limit); // query(queryList, [offset, limit]);
			var total = queryCount(query, req); //query("SELECT COUNT(*) FROM "+tableName);

			return q.all([rows, total])
				.finally(connection.done);
		}).spread(function(rows, total) {
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
				res.status(500).send(err.toString());
			});
	});

	return app;
};