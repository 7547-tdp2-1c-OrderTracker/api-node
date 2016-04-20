var request = require("supertest");
var q = require("q");

module.exports = function(app) {
	var post = function(uri, postData) {
		var d = q.defer();
		request(app)
			.post(uri)
			.send(postData)
			.end(d.makeNodeResolver());

		return d.promise;
	};

	return {
		post: post
	};
};


