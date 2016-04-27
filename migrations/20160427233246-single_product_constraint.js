'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex(
      'order_entries', 
      ['order_id', 'product_id'], 
      {indexName: 'reject_dup_products', indicesType: 'UNIQUE'});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('order_entries', 'reject_dup_products');
  }
};
