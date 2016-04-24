var sequelize_endpoint = require("./sequelize_endpoint");

var Client = require("./models/client")
module.exports = sequelize_endpoint(Client);
