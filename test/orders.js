var app = require("../server.js");
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var api = require("./helpers/api")(app);
var expectations = require("./helpers/expectations");

var assert = require("assert");

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
		return db.create();
	});

	beforeEach(function() {
		var self = this;

		return db.reset()
			.then(function() {
				return api.post("/v1/clients", {
					name: 'test'
				}).then(function(res) {
					self.client_id = res.body.id;
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
					vendor_id: 1,
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
					vendor_id: 1,
					currency: null
				}, function() { return this.response.body.results[0]; });
			});
		});

	});
});


