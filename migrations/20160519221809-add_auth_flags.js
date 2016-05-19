'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("configs", "auth_admin", {type: Sequelize.BOOLEAN, defaultValue: false});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn("configs", "auth_admin");
  }
};
