var sequelize_endpoint = require("./sequelize_endpoint");
var Visit = require("./models/visit");
var ScheduleEntry = require("./models/schedule_entry");
var moment = require("moment");

module.exports = sequelize_endpoint(Visit, {
	include: function(req) {
		if (!req.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};

		if (req.authInfo.admin) {
			return [{model: ScheduleEntry}];
		} else {
			var where = {seller_id: req.authInfo.seller_id};
			return [{
				model: ScheduleEntry,
				where: where
			}];
		}

	},
	beforePost: function(req) {
		if (!req.body.schedule_entry_id) {
			if (req.body.client_id && (req.body.day_of_week || req.body.seller_id)) {
				var where = {client_id: req.body.client_id};

				if (req.body.day_of_week) {
					where.day_of_week = req.body.day_of_week;
				}
				if (req.body.seller_id) {
					where.seller_id = req.body.seller_id;
				}

				return ScheduleEntry.findOne({where: where})
					.then(function(se) {
						if (!se) {
							throw {
								error: {
									key: "SCHEDULE_ENTRY_NOT_FOUND",
									value: "no se encuentra un schedule_entry de ese cliente y ese dia"
								},
								status: 400
							};
						}

						req.body.date = req.body.date || moment().toISOString();
						req.body.schedule_entry_id = se.get('id');
					});
			} else {
				throw {
					error: {
						key: "CANT_ASSOC_SCHEDULE_ENTRY", 
						value: 'no hay suficientes datos para asociar la visita a un schedule_entry'
					},
					status: 400
				};
			}
		}

		return {};
	}
});

