var app = require("../server.js");

var db = require("./helpers/db")(process.env.DATABASE_URL);
var api = require("./helpers/api")(app);
var expectations = require("./helpers/expectations");

describe("Brands", function() {
	beforeEach(function() {
		return db.reset();
	});

	describe("when create new brand", function() {
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
		}, function() { return this.returnedData; });
	});
});
