var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var push_notification_config = require("../../config/push_notification.json");

var Client = require("./client");
var Seller = require("./seller");

var afterCreate = function(instance) {
	return Client.findOne({where: {id: instance.get('client_id')}})
		.then(function(client) {
			// TODO: enviar push notification
			console.log("Agregado schedule entry para client");
			console.log(client.dataValues);

			console.log("TODO enviar push notification con key: " + push_notification_config.key);
		});
};

var ScheduleEntry = sequelize.define('schedule_entries', {
  day_of_week: Sequelize.INTEGER,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
  hooks: {
	afterCreate: afterCreate
  }
});

ScheduleEntry.belongsTo(Client, {foreignKey: 'client_id'});
ScheduleEntry.belongsTo(Seller, {foreignKey: 'seller_id'});

module.exports = ScheduleEntry;