var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");
var sequelize = require("./domain/sequelize");

var Client = require("./models/client");
var Seller = require("./models/seller");

var clientListQuery = 'select clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL OFFSET ? LIMIT ?;'
var	clientCountQuery = "select count(*) from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL;";

module.exports = sequelize_endpoint(Client, {
	customListQuery: function(req, limit, offset) {
		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				return sequelize.query(clientListQuery, {
					model: Client,
					replacements: [limit, offset]
				});
			}
		}
	},

	customCountQuery: function(req) {
		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				return sequelize.query(clientCountQuery).then(function(count) {
					return {
						get: function() {
							return count[0][0].count;
						}
					};
				});
			}
		}
	},

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
