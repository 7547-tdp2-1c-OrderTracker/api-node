var pg_endpoint = require("./pg_endpoint");

var mapList = function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host');
	if (req.get('port')) {
		fullUrl = fullUrl + ":" + req.get('port');
	}

	fullUrl = fullUrl + "/images";

	return function(brand) {
		if (brand.thumbnail && brand.thumbnail[0] === "/") {
			brand.thumbnail = fullUrl + brand.thumbnail;
		}
		return {
			id: brand.id,
			name: brand.name,
			picture: brand.picture
		};
	}
};

var mapGet = mapList;
var queryList = "SELECT * FROM brands OFFSET $1::int LIMIT $2::int";
var queryGet = "SELECT * FROM brands WHERE brands.id = $1::int";

module.exports = pg_endpoint("brands", queryList, queryGet, mapList, mapGet, {default_limit: 99999999});
