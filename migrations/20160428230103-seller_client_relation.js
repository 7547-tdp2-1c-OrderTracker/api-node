'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("clients", "seller_id", {type: Sequelize.INTEGER, references: {model: 'sellers', key: 'id', allowNull: true}});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("clients", "seller_id");
  }
};
