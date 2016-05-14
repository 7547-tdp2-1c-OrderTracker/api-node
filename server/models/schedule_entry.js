var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Client = require("./client");
var Seller = require("./seller");
var Device = require("./device");

var _ = require("underscore");
var q = require("q");
var push = q.denodeify(require("../domain/push").pushNewClientNotification);

var afterCreate = function(instance, options) {
	var seller_id = instance.get("seller_id");
	var client_id = instance.get("client_id");
    return q.all([
    	Device.findAll({where: {seller_id: seller_id}, group: ['registration_id'], attributes: ['registration_id']}),
    	Client.findOne({where: {id: client_id}})
    ])
    	.spread(function(devices, client) {
    		var tokens = devices.map(_.property('dataValues')).map(_.property("registration_id"));
    		return push(client.get("id"), client.get("name"), instance.get("lastname"), client.get("thumbnail"), tokens);
    	})
    	.catch(console.error.bind(console));
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