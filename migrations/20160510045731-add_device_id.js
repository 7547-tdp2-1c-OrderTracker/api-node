'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("devices", "device_id", Sequelize.STRING(1024));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn("devices", "device_id");
  }
};
