var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");
var sequelize = require("./domain/sequelize");

var Client = require("./models/client");
var Seller = require("./models/seller");

var clientListNullQuery = 'select clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL OFFSET ? LIMIT ?;'
var	clientCountNullQuery = "select count(*) from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL;";

var distance = "ST_Distance(clients.location, ST_GeographyFromText('SRID=4326;POINT(? ?)'))";
var clientListQuery = 'select ' + distance + ' as distance, clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.seller_id = ? ORDER BY ' + distance + ' OFFSET ? LIMIT ?;'
var clientCountQuery = 'select count(*) from clients left join schedule_entries as se on clients.id = se.client_id where se.seller_id = ?;'


module.exports = sequelize_endpoint(Client, {
	customListQuery: function(req, limit, offset) {
		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				return sequelize.query(clientListNullQuery, {
					model: Client,
					replacements: [offset, limit]
				});
			} else {
				return sequelize.query(clientListQuery, {
					model: Client,
					replacements: [req.query.lat, req.query.lon, req.query.seller_id, req.query.lat, req.query.lon, offset, limit]
				});
			}
		}
	},

	customCountQuery: function(req) {
		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				return sequelize.query(clientCountNullQuery).then(function(count) {
					return {
						get: function() {
							return count[0][0].count;
						}
					};
				});
			} else {
				return sequelize.query(clientCountQuery, {
					replacements: [req.query.seller_id]
				}).then(function(count) {
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
