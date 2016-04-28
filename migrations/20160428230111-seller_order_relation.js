'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("orders", "seller_id", {type: Sequelize.INTEGER, references: {model: 'sellers', key: 'id'}});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("orders", "seller_id");
  }
};
