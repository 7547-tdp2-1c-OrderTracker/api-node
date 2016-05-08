'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable("promotions", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING},
        percent: {type: Sequelize.INTEGER},
        product_id: {type: Sequelize.INTEGER, references: {model: 'products', key: 'id', allowNull: true}},
        brand_id: {type: Sequelize.INTEGER, references: {model: 'brands', key: 'id', allowNull: true}},
        begin_date: {type: Sequelize.DATE},
        end_date: {type: Sequelize.DATE},
        updated_at: {type: Sequelize.DATE},
        created_at: {type: Sequelize.DATE}
      });  
  },

  down: function (queryInterface, Sequelize) {
    return dropTable("promotions");
  }
};
