var app, api;
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
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
		return db.create().then(function() {

			// hay q hacer el require despues de inicializar la base de prueba
 			app = require("../server.js");
			api = require("./helpers/api")(app);
		});
	});

	beforeEach(function() {
		var self = this;

		return db.reset()
			.then(function() {
				return api.post("/v1/clients", {
					name: 'test',
					sellerType: 'retail'
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
						retailPrice: 30,
						brand_id: self.brand_id,
						currency: "ARS",
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

		describe("when get list of order items (GET /v1/orders/:order_id/order_items)", function() {
			beforeEach(function() {
				var self = this;
				return api.get("/v1/orders/" + self.order_id + "/order_items").then(function(r) {
					self.response = r;
				});
			});

			describe("paging", function() {
				it("should total 0", function() {
					assert.equal(this.response.body.paging.total, 0);
				});
			});

			describe("results", function() {
				describe("length", function() {
					it("should be 0", function() {
						assert.equal(this.response.body.results.length, 0);
					});
				});
			});
		});

		var getReturned = function() { return this.returnedData; };
		describe("when insert an order_item with quantity=1", function() {
			beforeEach(function() {
				var self = this;
				return api.post("/v1/orders/" + self.order_id + "/order_items", {quantity:1, product_id: this.product_id})
					.then(function(res) {
						self.order_entry_id = res.body.id;
						self.returnedData = res;
					});
			});

			describe("when get order (GET /v1/orders/:order_id)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/orders/" + this.order_id)
						.then(function(r) {
							self.returnedData = r;
						});
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						total_price: 30,
					}
				}, getReturned);
			});

			describe("when get list of order items (GET /v1/orders/:order_id/order_items)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/orders/" + self.order_id + "/order_items").then(function(r) {
						self.response = r;
					});
				});

				describe("paging", function() {
					it("should total 1", function() {
						assert.equal(this.response.body.paging.total, 1);
					});
				});

				describe("results", function() {
					describe("length", function() {
						it("should be 1", function() {
							assert.equal(this.response.body.results.length, 1);
						});
					});

					expectations.shouldBe({
						name: "test_product",
						brand: "test_brand",
						quantity: 1,
						unit_price: 30,
						currency: "ARS"
					}, function() { return this.response.body.results[0]; });
				});
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					currency: "ARS",
					unit_price: 30,
					brand: "test_brand",
					brand_name: "test_brand",
					quantity: 1
				}
			}, getReturned);

			describe("when update an order_item with quantity=11", function() {
				beforeEach(function() {
					var self = this;
					return api.put("/v1/orders/" + self.order_id + "/order_items/" + self.order_entry_id, {quantity:11})
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


				describe("when get list of order items (GET /v1/orders/:order_id/order_items)", function() {
					beforeEach(function() {
						var self = this;
						return api.get("/v1/orders/" + self.order_id + "/order_items").then(function(r) {
							self.response = r;
						});
					});

					describe("results", function() {
						expectations.shouldBe({
							name: "test_product",
							brand: "test_brand",
							quantity: 1,
							unit_price: 30,
							currency: "ARS"
						}, function() { return this.response.body.results[0]; });
					});
				});

				describe("when get order (GET /v1/orders/:order_id)", function() {
					beforeEach(function() {
						var self = this;
						return api.get("/v1/orders/" + this.order_id)
							.then(function(r) {
								self.returnedData = r;
							});
					});
					expectations.responseShouldBe({
						status:200,
						body: {
							total_price: 30,
						}
					}, getReturned);
				});

			});

			describe("when update an order_item with quantity=2", function() {
				beforeEach(function() {
					var self = this;
					return api.put("/v1/orders/" + self.order_id + "/order_items/" + self.order_entry_id, {quantity:2})
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
						quantity: 2,
						currency: "ARS"
					}
				}, getReturned);

				describe("when get order (GET /v1/orders/:order_id)", function() {
					beforeEach(function() {
						var self = this;
						return api.get("/v1/orders/" + this.order_id)
							.then(function(r) {
								self.returnedData = r;
							});
					});

					expectations.responseShouldBe({
						status:200,
						body: {
							total_price: 60,
						}
					}, getReturned);
				});

				describe("when delete order_entry", function() {
					beforeEach(function() {
						return api.del("/v1/orders/" + this.order_id + "/order_items/" + this.order_entry_id);
					});

					describe("when get list of order items (GET /v1/orders/:order_id/order_items)", function() {
						beforeEach(function() {
							var self = this;
							return api.get("/v1/orders/" + self.order_id + "/order_items").then(function(r) {
								self.response = r;
							});
						});

						describe("paging", function() {
							it("should total 0", function() {
								assert.equal(this.response.body.paging.total, 0);
							});
						});

						describe("results", function() {
							describe("length", function() {
								it("should be 0", function() {
									assert.equal(this.response.body.results.length, 0);
								});
							});
						});
					});

					describe("when get order (GET /v1/orders/:order_id)", function() {
						beforeEach(function() {
							var self = this;
							return api.get("/v1/orders/" + this.order_id)
								.then(function(r) {
									self.returnedData = r;
								});
						});

						expectations.responseShouldBe({
							status:200,
							body: {
								total_price: 0,
							}
						}, getReturned);
					});

				});

				describe("when get list of order items (GET /v1/orders/:order_id/order_items)", function() {
					beforeEach(function() {
						var self = this;
						return api.get("/v1/orders/" + self.order_id + "/order_items").then(function(r) {
							self.response = r;
						});
					});

					describe("results", function() {
						expectations.shouldBe({
							name: "test_product",
							brand: "test_brand",
							quantity: 2,
							unit_price: 30,
							currency: "ARS"
						}, function() { return this.response.body.results[0]; });
					});
				});
			});
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


