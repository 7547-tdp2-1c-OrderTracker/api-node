var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('sellers', {
	name: {type: Sequelize.STRING},
	lastname: {type: Sequelize.STRING},
	avatar: {type: Sequelize.STRING},
	email: {type: Sequelize.STRING},
	phone_number: {type: Sequelize.STRING(32)},
	date_created: {field: 'created_at', type: Sequelize.DATE},
	last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
	freezeTableName: true,
	updatedAt: 'last_modified',
	createdAt: 'date_created',
});

