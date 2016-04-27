'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable("brands",
      {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING},
        code: {type: Sequelize.STRING},
        picture: {type: Sequelize.STRING}
      }
    ).then(function() {
      return queryInterface.createTable("products", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        brand_id: {type: Sequelize.INTEGER, references: {model: 'brands', key: 'id'}},
        name: {type: Sequelize.STRING},
        code: {type: Sequelize.STRING},
        picture: {type: Sequelize.STRING},
        thumbnail: {type: Sequelize.STRING},
        description: {type: Sequelize.STRING},
        stock: {type: Sequelize.INTEGER},
        status: {type: Sequelize.INTEGER},
        wholesale_price: {type: Sequelize.INTEGER},
        retail_price: {type: Sequelize.INTEGER},
        currency: {type: Sequelize.STRING(4)}
      });
    }).then(function() {
      return queryInterface.createTable("clients", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING},
        lastname: {type: Sequelize.STRING},
        avatar: {type: Sequelize.STRING},
        thumbnail: {type: Sequelize.STRING},
        cuil: {type: Sequelize.STRING},
        address: {type: Sequelize.STRING},
        phone_number: {type: Sequelize.STRING(32)},
        email: {type: Sequelize.STRING},
        lat: {type: Sequelize.REAL},
        lon: {type: Sequelize.REAL},
        seller_type: {type: Sequelize.STRING(16)}
      });
    }).then(function() {
      return queryInterface.createTable("orders", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        delivery_date: {type: Sequelize.DATE},
        date_created: {type: Sequelize.DATE},
        status: {type: Sequelize.STRING(32), defaultValue: 'draft'},
        total_price: {type: Sequelize.INTEGER, defaultValue: 0},
        currency: {type: Sequelize.STRING(4)},
        client_id: {type: Sequelize.INTEGER, references: {model: 'clients', key: 'id'}},
        vendor_id: {type: Sequelize.INTEGER}
      });
    }).then(function() {
      return queryInterface.createTable("order_entries", {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        order_id: {type: Sequelize.INTEGER, references: {model: 'orders', key: 'id'}},
        product_id: {type: Sequelize.INTEGER, references: {model: 'products', key: 'id'}},
        name: {type: Sequelize.STRING},
        brand_name: {type: Sequelize.STRING},
        thumbnail: {type: Sequelize.STRING},
        quantity: {type: Sequelize.INTEGER},
        unit_price: {type: Sequelize.INTEGER},
        currency: {type: Sequelize.STRING(8)}
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    var dropTable = function(name) {
      return function() {
        return queryInterface.dropTable(name);
      };
    };
    return queryInterface.dropTable("order_entries")
      .then(dropTable("orders"))
      .then(dropTable("clients"))
      .then(dropTable("products"))
      .then(dropTable("brands"));
  }
};
