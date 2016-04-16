var pg_endpoint = require("./pg_endpoint");
var queryList = function(query, req, offset, limit) {
	return query("SELECT * FROM clients OFFSET $1::int LIMIT $2::int", [offset,limit]);
};
var queryCount = function(query, req) {
	return query("SELECT COUNT(*) FROM clients");
};
var queryGet = "SELECT * FROM clients WHERE id = $1::int";

var clientMap = function(req, res) {
	return function(client) {
		delete client.seller_type;
		client.sellerType = client.seller_type;
		return client;
	};
};

module.exports = pg_endpoint("clients", queryList, queryCount, queryGet, clientMap, clientMap, {
	fields: ["name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type"],
	fields_mapping: {
		"sellerType": "seller_type"
	}
});
