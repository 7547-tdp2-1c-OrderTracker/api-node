var express = require("express");
var argv = require("yargs").argv;
var fs = require("fs");
var app = express();

var port = argv.port || 8090;
var resourcePath = argv.path || "default";

var identity = function(x){return x; };
var clone = function(x){return JSON.parse(JSON.stringify(x))};
var serve = function(entityName, mapfunc) {
	var entities = require(__dirname + '/' + resourcePath + "/" + entityName + ".json");
	app.get("/v1/" + entityName + "/:id", function(req, res) {
		var entity = entities.filter(function(ent) {
			return ent.id.toString() === req.params.id.toString();
		})
			.map(clone)
			.map(mapfunc?mapfunc(req,res):identity)[0];

		res.setHeader('Content-type', 'application/json');

		if (entity) {
			res.write(JSON.stringify(entity,'\n','  '));
			res.end();
		} else {
			res.sendStatus(404);
		}
	});
	app.get("/v1/" + entityName, function(req, res) {
		var offset = parseInt(req.query.offset || '0');
		var limit = parseInt(req.query.limit || '20');

		res.setHeader('Content-type', 'application/json');

		var results = entities
				.slice(offset, offset+limit)
				.map(clone)
				.map(mapfunc?mapfunc(req,res):identity);

		res.write(JSON.stringify({
			paging: {
				total: entities.length,
				offset: offset,
				limit: limit
			},
			results: results
		},'\n','  '));
		res.end();
	});
};

serve('products', function(req,res) {
	var fullUrl = req.protocol + '://' + req.get('host');
	if (req.get('port')) {
		fullUrl = fullUrl + ":" + req.get('port');
	}

	fullUrl = fullUrl + "/images";

	return function(product) {
		if (product.thumbnail) {
			product.thumbnail = fullUrl + product.thumbnail;
		}
		if (product.picture) {
			product.picture = fullUrl + product.picture;
		}
		return product;
	}
});
serve('clients');

app.use("/images", express.static('images'));

app.listen(port, function() {
	console.log("log server listing on port " + port);
});