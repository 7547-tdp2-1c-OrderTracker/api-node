'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      "order_entries", 
      "promotion_id", 
      {type: Sequelize.INTEGER, references: {model: 'promotions', key: 'id', allowNull: true}}
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn("order_entries", "promotion_id");
  }
};
