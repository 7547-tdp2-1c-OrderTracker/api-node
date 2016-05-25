'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('products_categories', {
      product_id: {type: Sequelize.INTEGER, references: {model: 'products', key: 'id'}},
      category_id: {type: Sequelize.INTEGER, references: {model: 'categories', key: 'id'}},
      date_created: {type: Sequelize.DATE},
      last_modified: {type: Sequelize.DATE},
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('products_categories');
  }
};
