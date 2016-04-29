var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");

var Client = require("./models/client");

module.exports = sequelize_endpoint(Client, {
	order: function(req) {
		if (req.query.lat && req.query.lon && req.query.order === "distance") {
			// Evitar sql injection usando parseFloat
			var lat = parseFloat(req.query.lat);
			var lon = parseFloat(req.query.lon);

			console.log("order by distance from (" + lat + " " + lon + ")");

			return "ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(" + lat + " " + lon + ")'))";
		} else {
			return "lastname ASC";
		}
	},

	extraAttributes: function(req){
		if (req.query.lat && req.query.lon) {
			var lat = parseFloat(req.query.lat);
			var lon = parseFloat(req.query.lon);

			return [[Sequelize.literal("ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(" + lat + " " + lon + ")'))/1000"), "distance"]];
		} else {
			return [];
		}
	}
});
