var express = require("express");
var argv = require("yargs").argv;
var fs = require("fs");
var cors = require("cors");

var bodyParser = require('body-parser')

var clients = require("./server/clients");
var products = require("./server/products");
var brands = require("./server/brands");
var orders = require("./server/orders")
var sellers = require("./server/sellers")
var visits = require("./server/visits")
var schedule_entries = require("./server/schedule_entries");
var schedules = require("./server/schedules");
var promotions = require("./server/promotions");

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var port = process.env.PORT || 5000;
var resourcePath = argv.path || "default";

app.use("/v1/clients", clients);
app.use("/v1/products", products);
app.use("/v1/brands", brands);
app.use("/v1/orders", orders);
app.use("/v1/sellers", sellers);
app.use("/v1/visits", visits);
app.use("/v1/schedule_entries", schedule_entries);
app.use("/v1/schedules", schedules);
app.use("/v1/schedule", schedules);
app.use("/v1/promotions", promotions);

if (require.main === module) {
	app.listen(port, function() {
		console.log("log server listing on port " + port);
	});
} else {
	module.exports = app;
}