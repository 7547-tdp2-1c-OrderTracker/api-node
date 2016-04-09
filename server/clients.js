var pg_endpoint = require("./pg_endpoint");
var queryList = "SELECT * FROM clients OFFSET $1::int LIMIT $2::int";
var queryGet = "SELECT * FROM clients WHERE id = $1::int";

module.exports = pg_endpoint("clients", queryList, queryGet);
