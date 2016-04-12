var express = require("express");
var pg = require("pg");
var q = require("q");

var identity = function(obj){return obj; };

module.exports = function(tableName, queryList, queryCount, queryGet, listWrapper, getWrapper, options) {
	var app = express();
	options = options ||{};

	app.delete("/:id", function(req, res) {
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = q.denodeify(client.query.bind(client));
			query("DELETE FROM " + tableName + " WHERE id = $1::int", [req.params.id]).then(function() {
				res.sendStatus(204);
			}).finally(done);
		});
	});

	if (options.fields) {
		app.post("/", function(req, res) {
			var currentFields = options.fields.filter(function(fieldName) {
				return typeof req.body[fieldName] !== "undefined";
			});

			var queryText = "INSERT INTO " + tableName + " (" + currentFields.join(",") + ") VALUES (" + currentFields.map(function(fieldName, index) {
				return "$"+(index+1);
			}).join(",") + ")";

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				var query = q.denodeify(client.query.bind(client));
				query(queryText, currentFields.map(function(fieldName){
					return req.body[fieldName];
				})).then(function() {
					res.sendStatus(204);
				}).catch(function(err) {
					console.error(err);
					res.status(500).send(err.toString());
				}).finally(done);
			});
		});	

		app.put("/:id", function(req, res) {
			var currentFields = options.fields.filter(function(fieldName) {
				return typeof req.body[fieldName] !== "undefined";
			});

			var queryText = "UPDATE " + tableName + " SET " + currentFields.map(function(fieldName, index) {
				return fieldName + "=$"+(index+2);
			}).join(",") + " WHERE id = $1::int";

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				var query = q.denodeify(client.query.bind(client));
				var queryParams = [req.params.id].concat(currentFields.map(function(fieldName){
					return req.body[fieldName];
				}));
				
				query(queryText, queryParams).then(function() {
					res.sendStatus(204);
				}).catch(function(err) {
					console.error(err);
					res.status(500).send(err.toString());
				}).finally(done);
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

		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = q.denodeify(client.query.bind(client));
			query(queryGet, [req.params.id]).then(function(result) {
				res.send(wrapperInstance(result.rows[0]));
			}).catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
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

			var rows = queryList(query, req, offset, limit); // query(queryList, [offset, limit]);
			var total = queryCount(query, req); //query("SELECT COUNT(*) FROM "+tableName);

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
					res.status(500).send(err.toString());
				}).finally(done);
		});
	});

	return app;
};