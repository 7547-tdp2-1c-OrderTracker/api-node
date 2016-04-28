var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('sellers', {
	name: {type: Sequelize.STRING},
	lastname: {type: Sequelize.STRING},
	avatar: {type: Sequelize.STRING},
	email: {type: Sequelize.STRING},
	phone_number: {type: Sequelize.STRING(32)},
	created_at: Sequelize.DATE,
	updated_at: Sequelize.DATE
}, {
	freezeTableName: true,
	updatedAt: 'updated_at',
	createdAt: 'created_at'
});

