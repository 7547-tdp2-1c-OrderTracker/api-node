'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sellers', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: Sequelize.STRING},
      lastname: {type: Sequelize.STRING},
      avatar: {type: Sequelize.STRING},
      email: {type: Sequelize.STRING},
      phone_number: {type: Sequelize.STRING(32)},
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sellers');
  }
};
