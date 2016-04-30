var sequelize_endpoint = require("./sequelize_endpoint");
var ScheduleEntry = require("./models/schedule_entry");

module.exports = sequelize_endpoint(ScheduleEntry);

