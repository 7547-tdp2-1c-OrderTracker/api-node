var express = require("express");
var argv = require("yargs").argv;
var fs = require("fs");
var cors = require("cors");
var authConfig = require("./config/auth.json");
var bodyParser = require('body-parser');

var scanqr = require("./server/scanqr");
var clients = require("./server/clients");
var products = require("./server/products");
var brands = require("./server/brands");
var orders = require("./server/orders")
var sellers = require("./server/sellers")
var report = require("./server/report")
var visits = require("./server/visits")
var schedule_entries = require("./server/schedule_entries");
var schedules = require("./server/schedules");
var promotions = require("./server/promotions");
var devices = require("./server/devices");
var admins = require("./server/admins");
var config = require("./server/config");
var auth = require("./server/auth");
var auth_middleware = require("./server/auth_middleware");

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var port = process.env.PORT || 5000;
var resourcePath = argv.path || "default";

app.use(auth_middleware(authConfig.jwt.secret));

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
app.use("/v1/devices", devices);
app.use("/v1/config", config);
app.use("/v1/scanqr", scanqr);
app.use("/v1/admins", admins);
app.use("/v1/report", report);

app.use("/v1/auth", auth(authConfig.jwt.secret));

if (require.main === module) {
	app.listen(port, function() {
		console.log("log server listing on port " + port);
	});
} else {
	module.exports = app;
}
