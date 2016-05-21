var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");
var sequelize = require("./domain/sequelize");

var Client = require("./models/client");
var Seller = require("./models/seller");
var ScheduleEntry = require("./models/schedule_entry");

var clientListNullQuery = 'select clients.company as company, clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL OFFSET ? LIMIT ?;'
var	clientCountNullQuery = "select count(*) from clients left join schedule_entries as se on clients.id = se.client_id where se.id ISNULL;";

var md5 = require("md5");
var gravatarBaseUrl = "http://www.gravatar.com/avatar/";
var getGravatar = function(email, size) {
  var url = gravatarBaseUrl + md5(email) + "?d=identicon"
  if (size) {
    url = url + "&size=" + size;
  }
  return url;
};


var clientListQuery = function(lat, lon) {
	var locationColumn = process.env.POSTGIS_DISABLED ? "" : "clients.location as location,";
	if (lat && lon) {
		lat = parseFloat(lat);
		lon = parseFloat(lon);
		var distance = "ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT("+lat+" "+lon+")'))";
		return 'select clients.company as company, ' + distance + '/1000 as distance, clients.location as location, clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.seller_id = ? ORDER BY ' + distance + ' OFFSET ? LIMIT ?;';
	} else {
		return 'select clients.company as company, '+ locationColumn + ' clients.id, "name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type" AS "sellerType", clients.created_at AS "date_created", clients.updated_at AS "last_modified" from clients left join schedule_entries as se on clients.id = se.client_id where se.seller_id = ? OFFSET ? LIMIT ?;';
	}
}
var clientCountQuery = 'select count(*) from clients left join schedule_entries as se on clients.id = se.client_id where se.seller_id = ?;'


module.exports = sequelize_endpoint(Client, {
	map: function(client) {
		if (!client.avatar || !client.thumbnail) {
			client.avatar = getGravatar(client.email);
			client.thumbnail = getGravatar(client.email, 32);
		}
		return client;
	},
	customListQuery: function(req, limit, offset) {

		console.log("XXXX");
		console.log(req.authInfo);

		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				if (req.authInfo.admin) {
					return sequelize.query(clientListNullQuery, {
						model: Client,
						replacements: [offset, limit]
					});
				} else {
					return sequelize.query(clientListQuery(req.query.lat, req.query.lon), {
						model: Client,
						replacements: [-1, offset, limit]
					});
				}
			} else {
				if (!req.authInfo.admin) {
					if (req.query.seller_id != req.authInfo.seller_id) {
						req.query.seller_id = -1;
					}
				}

				return sequelize.query(clientListQuery(req.query.lat, req.query.lon), {
					model: Client,
					replacements: [req.query.seller_id, offset, limit]
				});
			}
		}
	},

	customCountQuery: function(req) {
		var returnCount = function(count) {
			return parseInt(count[0][0].count);
		};

		if(typeof req.query.seller_id !== "undefined") {
			if (req.query.seller_id === "null") {
				if (req.authInfo.admin) {
					return sequelize.query(clientCountNullQuery).then(returnCount);
				} else {
					return sequelize.query(clientCountQuery, {
						replacements: [-1]
					}).then(returnCount);
				}
			} else {
				if (!req.authInfo.admin) {
					if (req.query.seller_id != req.authInfo.seller_id) {
						req.query.seller_id = -1;
					}
				}

				return sequelize.query(clientCountQuery, {
					replacements: [req.query.seller_id]
				}).then(returnCount);
			}
		}
	},

	include: function(req) {
		if (!req.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};

		if (req.authInfo.admin) {
			return [{
				model: ScheduleEntry,
				required: false
			}];
		} else {
			var where = {seller_id: req.authInfo.seller_id};
			return [{
				model: ScheduleEntry,
				where: where
			}];
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
