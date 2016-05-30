'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("sellers", "version", {type: Sequelize.INTEGER, defaultValue: 0});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn("sellers", "version");
  }
};
