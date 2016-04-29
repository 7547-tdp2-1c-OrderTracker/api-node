var sequelize = require("./domain/sequelize");
var express = require("express");
var q = require("q");

var promised = function(f) {
	return function(req, res) {
		f(req, res)
			.then(function(value) {
				res.status(value.status).send(value.body);
			})
			.catch(function(err) {
				if (typeof err !== "object") {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				} else if (!err.error) {
					err = {error: {key: 'UNKNOWN', value: err.toString()}};
				}
				res.status(err.status||500).send(err);
			});
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
	include = options.include || [];

	if (!options.map) options.map = function(x){return x;};

	var postErrorHandler = options.postErrorHandler || function(err){ throw err; };

	// Create
	app.post(base, promised(function(req, res) {
		var newObj = {};
		for (var k in req.body) {
			newObj[k] = req.body[k];
		};

		for (var field in extra_fields) {
			newObj[field] = extra_fields[field](req);
		};

		return model.create(newObj)
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

	// Read
	app.get(base + "/:id", promised(function(req, res) {
		return model.findOne({where: {id: req.params.id}, include: include}).then(function(instance) {
			if (!instance) return {status: 404, body: "Not Found"};

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

	app.get(base, promised(function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || options.default_limit || '20');

		var where = {};
		var order = null;
		if (options.where) where = options.where(req);
		if (options.order) order = options.order(req);

		return q.all([
			model.findAll({limit: limit, offset: offset, where: where, order: order, include: include}),
			model.findOne({
				attributes: [[sequelize.fn('COUNT', sequelize.col("*")), "count"]],
				where: where
			})
		]).spread(function(instances, count) {
			return {
				body: {
					paging: {
						limit: limit,
						offset: offset,
						total: count.get("count")
					},
					results: instances.map(getDataValues).map(options.map)
				},
				status: 200
			};
		});
	}));

	// Update
	app.put(base + "/:id", promised(function(req, res) {
		return model.findOne({where: {id: req.params.id}})
			.then(function(instance) {
				return instance.update(req.body);
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

			return instance.destroy().then(function() {
				return {
					status: 204
				};
			});
		});
	}));

	return app;
};
