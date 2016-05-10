var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");
var Seller = require("./seller");

var ScheduleEntry = sequelize.define('schedule_entries', {
  day_of_week: Sequelize.INTEGER,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created'
});

ScheduleEntry.belongsTo(Client, {foreignKey: 'client_id'});
ScheduleEntry.belongsTo(Seller, {foreignKey: 'seller_id'});

module.exports = ScheduleEntry;