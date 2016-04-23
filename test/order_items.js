var app = require("../server.js");
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var api = require("./helpers/api")(app);
var expectations = require("./helpers/expectations");

var assert = require("assert");

var getReturned = function() { return this.returnedData; };

/*
	Testea las funcionalidades que involucran a order_items
	Pero se omite el testing de lo que ya se testea en test/orders.js

	Se crean clients y orders como parte del testing, pero no se verifican
*/

describe("Orders", function() {
	this.timeout(100000);
	before(function() {
		return db.create();
	});

	beforeEach(function() {
		var self = this;

		return db.reset()
			.then(function() {
				return api.post("/v1/clients", {
					name: 'test',
					seller_type: 'retail'
				}).then(function(res) {
					self.client_id = res.body.id;

					return api.post('/v1/brands', {
						name: 'test_brand',
						picture: 'picture'
					});
				}).then(function(res) {
					self.brand_id = res.body.id;

					return api.post('/v1/products', {
						name: 'test_product',
						picture: 'picture',
						retail_price: 30,
						brand_id: self.brand_id,
						stock: 10
					});
				}).then(function(res) {
					self.product_id = res.body.id;
				});
			});
	});
	describe("when create an order", function() {
		beforeEach(function() {
			var self = this;
			return api.post("/v1/orders", {client_id: this.client_id, vendor_id: 1})
						.then(function(res) {
							self.order_id = res.body.id;
						});
		});

		var getReturned = function() { return this.returnedData; };
		describe("when insert an order_item with quantity=1", function() {
			beforeEach(function() {
				var self = this;
				return api.post("/v1/orders/" + self.order_id + "/order_items", {quantity:1, product_id: this.product_id})
					.then(function(res) {
						self.returnedData = res;
					});
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					currency: null,
					unit_price: 30,
					brand: "test_brand",
					brand_name: "test_brand",
					quantity: 1
				}
			}, getReturned);
		});

		describe("when insert an order_item with quantity=11", function() {
			beforeEach(function() {
				var self = this;
				return api.post("/v1/orders/" + self.order_id + "/order_items", {quantity:11, product_id: this.product_id})
					.then(function(res) {
						self.returnedData = res;
					});
			});

			expectations.responseShouldBe({
				status:400,
				body: {
					error: "NO_STOCK"
				}
			}, getReturned);
		});

	});
});


