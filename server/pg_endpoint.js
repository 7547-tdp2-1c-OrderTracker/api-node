var express = require("express");
var pg = require("pg");
var q = require("q");

var identity = function(obj){return obj; };

module.exports = function(tableName, queryList, queryCount, queryGet, listWrapper, getWrapper, options) {
	var app = express();
	options = options ||{};
	var base = options.base||"";

	var pgConnect = q.denodeify(function(url, callback) {
		pg.connect(url, function(err, client, done) {
			callback(err, {
				client: client,
				done: done
			});
		});
	});

	var postErrorHandler = options.postErrorHandler || function(err, res) {
		res.status(500).send(err.toString());
	};

	app.delete(base + "/:id", function(req, res) {
		pgConnect(process.env.DATABASE_URL).then(function(connection) {
			var client = connection.client;
			var query = q.denodeify(client.query.bind(client));
			return query("DELETE FROM " + tableName + " WHERE id = $1::int", [req.params.id])
				.finally(connection.done);
		}).then(function() {
				if (options.afterRemove) {
					return q(options.afterRemove(req, res, req.params.id));
				}
			})
			.then(function() {
				res.sendStatus(204);
			}).catch(function(err) {
				console.error(err);
				res.status(500).send(err.toString());
			});
	});

	var returnById = function(req, res, id) {
		var wrapperInstance;
		if (getWrapper) {
			wrapperInstance = getWrapper(req, res);
		} else {
			wrapperInstance = identity;
		}

		return pgConnect(process.env.DATABASE_URL).then(function(connection) {
			var client = connection.client;
			var query = q.denodeify(client.query.bind(client));

			return query(queryGet, [id])
				.finally(connection.done);
		}).then(function(result) {
			res.send(wrapperInstance(result.rows[0], result.rows));
		});
	};

	if (options.fields) {
		app.post(base + "/", function(req, res) {
			pgConnect(process.env.DATABASE_URL).then(function(connection) {
				var values = {};
				var _default = options._default||{};
				for (var k in _default) {
					if (!req.body[k]) req.body[k] = _default[k]();
				};

				var currentFields = options.fields.filter(function(fieldName) {
					values[fieldName] = req.body[fieldName];
					return typeof req.body[fieldName] !== "undefined";
				});

				if (options.params_fields) {
					var paramsFields = options.params_fields.filter(function(fieldName) {
						values[fieldName] = req.params[fieldName];
						return typeof req.params[fieldName] !== "undefined";
					});
					currentFields = currentFields.concat(paramsFields);
				}

				var queryText = "INSERT INTO " + tableName + " (" + currentFields.join(",") + ") VALUES (" + currentFields.map(function(fieldName, index) {
					return "$"+(index+1);
				}).join(",") + ") RETURNING id";

				var client = connection.client;
				var query = q.denodeify(client.query.bind(client));

				return query(queryText, currentFields.map(function(fieldName){
					return values[fieldName];
				}))
					.finally(connection.done);
			})
				.then(function(result) {
					if (options.afterCreate) {
						return q(options.afterCreate(req, res, result.rows[0].id))
							.then(function() {
								return result;
							});
					}

					return result;
				})
				.catch(function(err) {
					return postErrorHandler(req, err);
				})
				.then(function(result) {
					return returnById(req, res, result.rows[0].id);
				})
				.catch(function(err) {
					res.status(500).send(err);
				});
		});	

		app.put(base + "/:id", function(req, res) {
			pgConnect(process.env.DATABASE_URL).then(function(connection) {
				var values = {};

				var currentFields = options.fields.filter(function(fieldName) {
					values[fieldName] = req.body[fieldName];
					return typeof req.body[fieldName] !== "undefined";
				});

				if (options.params_fields) {
					var paramsFields = options.params_fields.filter(function(fieldName) {
						values[fieldName] = req.params[fieldName];
						return typeof req.params[fieldName] !== "undefined";
					});
					currentFields = currentFields.concat(paramsFields);
				}

				if (!currentFields.length) return;

				var queryText = "UPDATE " + tableName + " SET " + currentFields.map(function(fieldName, index) {
					return fieldName + "=$"+(index+2);
				}).join(",") + " WHERE id = $1::int";

				var client = connection.client;
				var query = q.denodeify(client.query.bind(client));
				var queryParams = [req.params.id].concat(currentFields.map(function(fieldName){
					return values[fieldName];
				}));
				
				return query(queryText, queryParams)
					.finally(connection.done)
			})
				.then(function() {
					if (options.afterUpdate) {
						return q(options.afterUpdate(req, res, req.params.id));
					}
				})
				.then(function() {
					return returnById(req, res, req.params.id);
				}).catch(function(err) {
					res.status(500).send(err.toString());
					return;
				});
		});	

	}

	app.get(base + "/:id", function(req, res) {
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
			if (result.rows && result.rows.length) {
				res.send(wrapperInstance(result.rows[0], result.rows));
			} else {
				res.status(404).send("Not found");
			}
		}).catch(function(err) {
			console.error(err);
			res.status(500).send(err.toString());
		});
	});

	app.get(base + "/", function(req, res) {
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