var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var ScheduleEntry = require("./schedule_entry");

var Visit = sequelize.define('visits', {
  date: Sequelize.DATE,
  comment: Sequelize.STRING,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Visit.belongsTo(ScheduleEntry, {foreignKey: 'schedule_entry_id'});

module.exports = Visit;