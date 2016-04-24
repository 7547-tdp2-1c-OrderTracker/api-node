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
				res.status(500).send(err.toString());
			});
	};
};

var ret = function(model, options) {
	var app = express();
	var base;

	options = options || {};
	base = options.base||"";

	// Create
	app.post(base, promised(function(req, res) {
		return model.create(req.body).then(function(instance) {
			return {
				body: instance.dataValues,
				status: 200
			};
		});
	}));	

	// Read
	app.get(base + "/:id", promised(function(req, res) {
		return model.findOne({where: {id: req.params.id}}).then(function(instance) {
			if (!instance) return {status: 404, body: "Not Found"};

			return {
				body: instance.dataValues,
				status: 200
			};
		});
	}));

	// list
	app.get(base, promised(function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || options.default_limit || '20');

		var where = {};
		if (options.where) where = options.where(req, res);

		return q.all([
			model.findAll({limit: limit, offset: offset, where: where}),
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
					results: instances
				},
				status: 200
			};
		});
	}));

	// Update
	app.put(base + "/:id", promised(function(req, res) {
		return model.update(req.body, {where: {id: req.params.id}}).then(function(instance) {
			return model.findOne({where: {id: req.params.id}}).then(function(instance) {
				return {
					body: instance.dataValues,
					status: 200
				};
			});
		});
	}));

	// Destroy
	app.del(base + "/:id", promised(function(req, res) {
		return model.destroy({where: {id: req.params.id}}).then(function() {
			return {
				status: 204
			};
		});
	}));

	return app;
};

module.exports = ret;