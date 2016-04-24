var app, api;

var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var expectations = require("./helpers/expectations");

var assert = require("assert");

var getReturned = function() { return this.returnedData; };
describe("products", function() {
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
					return api.post('/v1/brands', {
						name: 'Nike',
						picture: 'picture'
					});
				}).then(function(res) {
					self.brand_id = res.body.id;
				});
	});

	describe("when create new product (POST /v1/products)", function() {
		beforeEach(function() {
			var self = this;
			this.returnedData = api.post("/v1/products", {
				name: "Zapatilla",
				brand_id: this.brand_id,
				description: "X",
				retailPrice: 10,
				wholesalePrice: 20,
				stock: 60,
				currency: "ARS",
				thumbnail: "thumbnail",
				picture: "picture"
			});
			return this.returnedData.then(function(x) {
				self.product_id = x.body.id;
			});
		});

		expectations.responseShouldBe({
			status: 200,
			body: {
				name: "Zapatilla",
				description: "X",
				retailPrice: 10,
				wholesalePrice: 20,
				stock: 60,
				currency: "ARS",
				thumbnail: "thumbnail",
				picture: "picture"
			}
		}, getReturned);

		describe("when get the same product (GET /v1/products/:id)", function() {
			beforeEach(function() {
				return api.get("/v1/products/" + this.product_id);
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Zapatilla",
					description: "X",
					retailPrice: 10,
					wholesalePrice: 20,
					stock: 60,
					currency: "ARS",
					thumbnail: "thumbnail",
					picture: "picture"
				}
			}, getReturned);
		});

		describe("when put the same product (PUT /v1/products/:id) with retailPrice=15", function() {
			beforeEach(function() {
				var self = this;
				return api.put("/v1/products/" + this.product_id, {retailPrice: 15})
					.then(function(res) {
						self.returnedData = res;
					});

			});

			expectations.responseShouldBe({
				status:200,
				body: {
					retailPrice: 15,
				}
			}, getReturned);

			describe("when get the same product (GET /v1/products/:id)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/products/" + this.product_id)
						.then(function(res) {
							self.returnedData = res;
						});
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						retailPrice: 15
					}
				}, getReturned);
			});
		});

		describe("when put the same product (PUT /v1/products/:id) with description='Zapatilla' and stock=70", function() {
			beforeEach(function() {
				var self = this;
				return api.put("/v1/products/" + this.product_id, {description: "Zapatilla", stock: 70})
					.then(function(res) {
						self.returnedData = res;
					});
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Zapatilla",
					description: "Zapatilla",
					retailPrice: 10,
					wholesalePrice: 20,
					stock: 70,
					currency: "ARS",
					thumbnail: "thumbnail",
					picture: "picture"
				}
			}, getReturned);

			describe("when get the same product (GET /v1/products/:id)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/products/" + this.product_id)
						.then(function(response) {
							self.returnedData = response;
						});
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						name: "Zapatilla",
						description: "Zapatilla",
						retailPrice: 10,
						wholesalePrice: 20,
						stock: 70,
						currency: "ARS",
						thumbnail: "thumbnail",
						picture: "picture"
					}
				}, getReturned);
			});

		});

		describe("when delete product (DELETE /v1/products/:id)", function() {
			beforeEach(function() {
				var self = this;
				return api.del("/v1/products/" + this.product_id)
					.then(function(x) {
						self.deleteReturned = x;
					});
			});

			expectations.responseShouldBe({
				status:204
			}, function() {return this.deleteReturned; });

			describe("when get list of products (GET /v1/products)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/products").then(function(r) {
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
		});

		describe("when get list of products (GET /v1/products)", function() {
			beforeEach(function() {
				var self = this;
				return api.get("/v1/products").then(function(r) {
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
					name: "Zapatilla",
					description: "X",
					retailPrice: 10,
					wholesalePrice: 20,
					stock: 60,
					currency: "ARS",
					thumbnail: "thumbnail",
					picture: "picture"
				}, function() { return this.response.body.results[0]; });
			});
		});
	});
});
