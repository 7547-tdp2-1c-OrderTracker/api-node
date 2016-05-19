var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var ScheduleEntry = require("./schedule_entry");

var beforeCreate = function(instance, options) {
	if (options.authInfo.admin) return;

	return ScheduleEntry.findOne({where: {id: instance.get("schedule_entry_id")}})
		.then(function(se) {
			if (!se) {
				throw {error: {key: 'FORBIDDEN', value: 'no se puede crear una visita para ese vendedor'}, status: 403};
			} else {
				sequelize.onlySeller(se, options, 'no se puede crear una visita para ese vendedor');
			}
		});
};

var beforeUpdate = beforeCreate;

var Visit = sequelize.define('visits', {
  date: Sequelize.DATE,
  comment: Sequelize.STRING,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  hooks: {
  	beforeCreate: beforeCreate,
  	beforeUpdate: beforeUpdate
  },
  updatedAt: 'last_modified',
  createdAt: 'date_created'
});

Visit.belongsTo(ScheduleEntry, {foreignKey: 'schedule_entry_id'});
ScheduleEntry.hasMany(Visit, {foreignKey: 'schedule_entry_id'});

module.exports = Visit;