var assert = require("assert");

var responseShouldBe = function(options, element) {
	describe("returned", function() {
		beforeEach(function() {
			var self = this;
			element.bind(this)().then(function(x) {
				self.obj = x;
			});
		});

		describe("status", function() {
			it("should be " + options.status, function() {
				assert.equal(this.obj.status, options.status);
			});
		});

		if (options.body) {
			describe("body", function() {
				it("should have " + JSON.stringify(options.body), function() {
					var self = this;
					Object.keys(options.body).forEach(function(key) {
						assert.equal(self.obj.body[key], options.body[key]);
					});
				});
			});
		}
	});

};

module.exports = {
	responseShouldBe: responseShouldBe
};
