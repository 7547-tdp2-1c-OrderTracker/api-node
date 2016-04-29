var express = require("express");
var argv = require("yargs").argv;
var fs = require("fs");
var cors = require("cors");

var bodyParser = require('body-parser')
/*
var clients = require("./server/clients");
var products = require("./server/products");
var brands = require("./server/brands");
var orders = require("./server/orders")
*/
var schedule = require("./server/schedule")

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var port = process.env.PORT || 5000;
var resourcePath = argv.path || "default";
/*
app.use("/v1/clients", clients);
app.use("/v1/products", products);
app.use("/v1/brands", brands);
app.use("/v1/orders", orders);
*/
app.use("/v1/schedule", schedule);

if (require.main === module) {
	app.listen(port, function() {
		console.log("log server listing on port " + port);
	});
} else {
	module.exports = app;
}