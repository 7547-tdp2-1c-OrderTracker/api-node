var sequelize = require("./domain/sequelize");
var express = require("express");
var q = require("q");

var promised = function(f) {
	return function(req, res) {
		q().then(function() {
				return f(req, res);
			})
			.then(function(value) {
				res.status(value.status).send(value.body);
			})
			.catch(function(err) {
				console.error(err);

				if (typeof err !== "object") {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				} else if (!err.error) {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				}
				res.status(err.status||500).send(err);
			});
	};
};

var to_function = function(x) {
	if (typeof x === "function") return x;
	return function(req) {
		return x;
	};
};

module.exports = function(model, options) {
	var app = express();
	var base;
	var extra_fields;
	var include;

	options = options || {};
	base = options.base||"";
	extra_fields = options.extra_fields ||{};
	include = to_function(options.include || []);

	if (!options.map) options.map = function(x){return x;};

	options.customListQuery = options.customListQuery || function(){return null; };
	options.customCountQuery = options.customCountQuery || function(){return null; };

	var postErrorHandler = options.postErrorHandler || function(err){ throw err; };

	if (!options.beforePost) {
		options.beforePost = function() {};
	}

	// Create
	if (!options.readonly) {
		app.post(base, promised(function(req, res) {
			return q.fcall(options.beforePost.bind(options, req))
				.then(function() {
					var newObj = {};
					for (var k in req.body) {
						newObj[k] = req.body[k];
					};

					for (var field in extra_fields) {
						newObj[field] = extra_fields[field](req);
					};

					return model.create(newObj, {authInfo: req.authInfo});
				})
				.catch(function(err) {
					return postErrorHandler(err, req);
				})
				.then(function(instance) {
					return model.findOne({where: {id: instance.id}})
				})
				.then(function(instance) {
					return {
						body: options.map(instance.dataValues),
						status: 200
					};
				});
		}));	
	}

	// Read
	app.get(base + "/:id", promised(function(req, res) {
		var where = {$and: [{}]};
		var primaryKey = options.primaryKey || "id";
		where.$and[0][primaryKey] = req.params.id;

		if (model.listRestriction) {
			where.$and.push(model.listRestriction(req.authInfo));
		}

		return model.findOne({where: where, include: include(req)}).then(function(instance) {
			if (!instance) {
				throw {error: {key: 'NOT_FOUND', value: 'el recurso que se intento leer no se encuentra'}, status: 404};
			}

			return {
				body: options.map(instance.dataValues),
				status: 200
			};
		});
	}));

	// list

	var getDataValues = function(x) {
		return x.dataValues;
	};

	var listQuery = function(req, limit, offset) {
		var where = {$and: []};
		var order = null;

		if (options.where) where.$and.push(options.where(req));
		if (options.order) order = options.order(req);

		if (req.query.where) {
			where.$and.push(JSON.parse(req.query.where));
		}

		if (model.listRestriction) {
			where.$and.push(model.listRestriction(req.authInfo));
		}

		return options.customListQuery(req, limit, offset) || model.findAll({limit: limit, offset: offset, where: where, order: order, include: include(req),
				attributes: {
					include: options.extraAttributes ? options.extraAttributes(req) : []
				}});
	};

	var countQuery = function(req) {
		var where = {$and: []};
		if (options.where) where.$and.push(options.where(req));
		if (req.query.where) {
			where.$and.push(JSON.parse(req.query.where));
		}

		if (model.listRestriction) {
			where.$and.push(model.listRestriction(req.authInfo));
		}

		return options.customCountQuery(req) || model.count({
				include: include(req),
				where: where
			});
	}

	app.get(base, promised(function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || options.default_limit || '20');

		var where;
		if (options.where) where = options.where(req);
		return q.all([
			listQuery(req, limit, offset),
			countQuery(req)
		]).spread(function(instances, count) {
			return {
				body: {
					paging: {
						limit: limit,
						offset: offset,
						total: count
					},
					results: instances.map(getDataValues).map(options.map)
				},
				status: 200
			};
		});
	}));

	// Update
	if (!options.readonly) {
		app.put(base + "/:id", promised(function(req, res) {
			return model.findOne({where: {id: req.params.id}})
				.then(function(instance) {
					if (!instance) {
						throw {error: {key: 'NOT_FOUND', value: 'el recurso que se intento modificar no se encuentra'}, status: 404};
					}

					return instance.update(req.body, {authInfo: req.authInfo});
				})
				.then(function() {
					return model.findOne({where: {id: req.params.id}})
				})
				.then(function(instance) {
					return {
						body: options.map(instance.dataValues),
						status: 200
					};
				});
		}));

		// Destroy
		app.del(base + "/:id", promised(function(req, res) {
			return model.findOne({where: {id: req.params.id}}).then(function(instance) {
				if (!instance) {
					throw {error: {key: 'NOT_FOUND', value: 'el recurso que se intento eliminar no se encuentra'}, status: 404};
				}

				return instance.destroy({authInfo: req.authInfo}).then(function() {
					return {
						body: options.map(instance.dataValues),
						status: 200
					};
				});
			});
		}));
	}

	return app;
};
