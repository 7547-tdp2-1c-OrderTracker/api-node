var app, api;
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var expectations = require("./helpers/expectations");

var assert = require("assert");

var getReturned = function() { return this.returnedData; };
describe("Brands", function() {
	this.timeout(100000);
	before(function() {
		return db.create().then(function() {

			// hay q hacer el require despues de inicializar la base de prueba
 			app = require("../server.js");
			api = require("./helpers/api")(app);
		});
	});

	beforeEach(function() {
		return db.reset();
	});

	describe("when create new brand (POST /v1/brands)", function() {
		beforeEach(function() {
			this.returnedData = api.post("/v1/brands", {
				name: "Nike",
				picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
			});
			return this.returnedData;
		});

		expectations.responseShouldBe({
			status: 200,
			body: {
				name: "Nike",
				picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
			}
		}, getReturned);

		describe("when get the same brand (GET /v1/brands/:id)", function() {
			beforeEach(function() {
				this.returnedData = this.returnedData.then(function(x) {
					return api.get("/v1/brands/" + x.body.id);
				})
				return this.returnedData;
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Nike",
					picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
				}
			}, getReturned);
		});

		describe("when put the same brand (PUT /v1/brands/:id) with name='Puma'", function() {
			beforeEach(function() {
				this.returnedData = this.returnedData.then(function(x) {
					return api.put("/v1/brands/" + x.body.id, {name: "Puma"});
				})
				return this.returnedData;
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Puma",
					picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
				}
			}, getReturned);

			describe("when get the same brand (GET /v1/brands/:id)", function() {
				beforeEach(function() {
					this.returnedData = this.returnedData.then(function(x) {
						return api.get("/v1/brands/" + x.body.id);
					})
					return this.returnedData;
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						name: "Puma",
						picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
					}
				}, getReturned);
			});

		});

		describe("when delete brand (DELETE /v1/brands/:id)", function() {
			beforeEach(function() {
				this.deleteReturned = this.returnedData.then(function(x) {
					return api.del("/v1/brands/" + x.body.id);
				})
				return this.deleteReturned;
			});

			expectations.responseShouldBe({
				status:204
			}, function() {return this.deleteReturned; });

			describe("when get list of brands (GET /v1/brands)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/brands").then(function(r) {
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

		describe("when get list of brands (GET /v1/brands)", function() {
			beforeEach(function() {
				var self = this;
				return api.get("/v1/brands").then(function(r) {
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
					name: "Nike",
					picture: "http://showsport.vteximg.com.br/arquivos/ids/165247/nike-brand-icon.png"
				}, function() { return this.response.body.results[0]; });
			});
		});
	});
});
