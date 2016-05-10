'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('devices', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      seller_id: {type: Sequelize.INTEGER, references: {model: 'sellers', key: 'id'}},
      registration_token: Sequelize.STRING(1024),
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('devices');
  }
};
