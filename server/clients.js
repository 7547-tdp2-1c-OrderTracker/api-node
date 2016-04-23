var express = require("express");

var pg_endpoint = require("./pg_endpoint");
var queryList = function(query, req, offset, limit) {
	return query("SELECT * FROM clients ORDER BY lastname OFFSET $1::int LIMIT $2::int", [offset,limit]);
};
var queryCount = function(query, req) {
	return query("SELECT COUNT(*) FROM clients");
};
var queryGet = "SELECT * FROM clients WHERE id = $1::int";

var clientMap = function(req, res) {
	return function(client) {
		client.sellerType = client.seller_type;
		delete client.seller_type;
		return client;
	};
};

var app = express();

var clients = pg_endpoint("clients", queryList, queryCount, queryGet, clientMap, clientMap, {
	fields: ["name", "lastname", "avatar", "thumbnail", "cuil", "address", "phone_number", "email", "lat", "lon", "seller_type"]
});

var readAliasFields = function(req, res, next) {
	if (req.method === "POST" || req.method === "PUT") {
		if (req.body.sellerType) {
			req.body.seller_type = req.body.sellerType;
		}
	}
	next();
};

app.use(readAliasFields);
app.use(clients);

module.exports = app;
