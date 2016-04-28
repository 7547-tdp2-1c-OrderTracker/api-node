'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("orders", "vendor_id");
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("orders", "vendor_id", Sequelize.INTEGER);
  }
};
