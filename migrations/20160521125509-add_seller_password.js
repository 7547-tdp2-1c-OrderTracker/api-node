'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("sellers", "password", {type: Sequelize.STRING(255)});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn("sellers", "password");
  }
};
