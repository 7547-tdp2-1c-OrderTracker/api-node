var sequelize_endpoint = require("./sequelize_endpoint");
var ScheduleEntry = require("./models/schedule_entry");

var filterFields = ['day_of_week', 'client_id', 'seller_id'];
module.exports = sequelize_endpoint(ScheduleEntry, {
	where: function(req) {
		var filters = {};
		filterFields.forEach(function(field) {
			if (req.query[field]) {
				filters[field] = req.query[field];
			}
		});

		return filters;
	}
});

