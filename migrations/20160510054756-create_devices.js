'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('devices', {
      device_id: {type: Sequelize.STRING(1024), primaryKey: true},
      seller_id: {type: Sequelize.INTEGER, references: {model: 'sellers', key: 'id'}},
      registration_id: Sequelize.STRING(1024),
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('devices');
  }
};
