var app, api;
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var expectations = require("./helpers/expectations");

var assert = require("assert");
var q = require("q");

var getReturned = function() { return this.returnedData; };

/*
	Testea todas las funcionalidaes de la order (pedido) que NO involucren
	a order_items. Por ej verifica que si se da de alta una orden empieza
	con el status draft y el total_price 0, pero no testea que pasa
	cuando se agregar order_items

	El test de order items esta en un grupo de tests aparte (order_items.js)
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
				return q.all([
					api.post("/v1/clients", {name: 'test1', sellerType: 'retail'}), // hay que crear dos clients para crear dos pedidos
					api.post("/v1/clients", {name: 'test2', sellerType: 'retail'}),
					api.post('/v1/brands', {name: 'test_brand',picture: 'picture'})
				]).spread(function(client1, client2, brand) {
					self.client_id1 = client1.body.id;
					self.client_id2 = client2.body.id;

					return api.post('/v1/products', {
						name: 'test_product',
						picture: 'picture',
						retailPrice: 30,
						brand_id: brand.body.id,
						currency: "ARS",
						stock: 1
					});					
				}).then(function(product) {
					self.product_id = product.body.id;
				});
			});
	});

	describe("when create an order", function() {
		beforeEach(function() {
			var self = this;
			return api.post("/v1/orders", {client_id: this.client_id1})
						.then(function(res) {
							self.order_id = res.body.id;
						});
		});

		describe("when get the same order (GET /v1/orders/:id)", function() {
			beforeEach(function() {
				this.returnedData = api.get("/v1/orders/" + this.order_id);
				return this.returnedData;
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					status: "draft",
					total_price: 0,
					currency: null
				}
			}, getReturned);
		});

		describe("when get list of orders (GET /v1/orders)", function() {
			beforeEach(function() {
				var self = this;
				return api.get("/v1/orders").then(function(r) {
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
					status: "draft",
					total_price: 0,
					currency: null
				}, function() { return this.response.body.results[0]; });
			});
		});

		var firstOrderConfirm = function() {
			beforeEach(function() {
				return api.post("/v1/orders/" + this.order_id + "/order_items", {product_id: this.product_id, quantity: 1});
			});

			describe("when add a item to second order", function() {
				beforeEach(function() {
					return api.post("/v1/orders/" + this.order_id2 + "/order_items", {product_id: this.product_id, quantity: 1});
				});

				describe("when confirm first order", function() {
					beforeEach(function() {
						var self = this;
						return api.put("/v1/orders/" + self.order_id, {status: 'confirmed'})
							.then(function(res) {
								self.returnedData = res;
							});
					});

					expectations.responseShouldBe({
						status:200,
						body: {
							status: "confirmed",
						}
					}, getReturned);

					describe("when confirm second order", function() {
						beforeEach(function() {
							var self = this;
							return api.put("/v1/orders/" + self.order_id2, {status: 'confirmed'})
								.then(function(res) {
									self.returnedData = res;
								});
						});

						// al intentar confirmar el segundo pedido, tiene que dar error porque
						// ya se agoto el stock con el otro pedido
						expectations.responseShouldBe({
							status:400,
							body: {
								error: {key: "NO_STOCK", value: "no se puede confirmar el pedido porque no alcanza el stock"},
							}
						}, getReturned);

						describe("when get second order (GET /v1/orders/:id)", function() {
							beforeEach(function() {
								var self = this;
								return api.get("/v1/orders/" + this.order_id2)
									.then(function(res) {
										self.returnedData = res;
									});
							});

							// y el status del order no deberia cambiar (deberia seguir en draft)
							expectations.responseShouldBe({
								status:200,
								body: {
									status: "draft",
								}
							}, getReturned);
						});


					});


				});
			});
		};

		describe("when create a second order", function() {
			beforeEach(function() {
				var self = this;
				return api.post("/v1/orders", {client_id: this.client_id2})
							.then(function(res) {
								self.order_id2 = res.body.id;
							});
			});

			describe("when add a item to first order", firstOrderConfirm);

			describe("when get list of orders (GET /v1/orders)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/orders").then(function(r) {
						self.response = r;
					});
				});

				describe("paging", function() {
					it("should total 2", function() {
						assert.equal(this.response.body.paging.total, 2);
					});
				});

				describe("results", function() {
					describe("length", function() {
						it("should be 2", function() {
							assert.equal(this.response.body.results.length, 2);
						});
					});

					describe("order 0", function() {
						expectations.shouldBe({
							status: "draft",
							total_price: 0,
							currency: null
						}, function() { return this.response.body.results[0]; });
					});

					describe("order 1", function() {
						expectations.shouldBe({
							status: "draft",
							total_price: 0,
							currency: null
						}, function() { return this.response.body.results[1]; });
					});
				});
			});
		});

	});
});


