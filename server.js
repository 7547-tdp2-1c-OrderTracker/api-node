var express = require("express");
var argv = require("yargs").argv;
var fs = require("fs");
var clients = require("./server/clients");
var products = require("./server/products");

var app = express();

var port = process.env.PORT || 5000;
var resourcePath = argv.path || "default";

app.use("/v1/clients", clients);
app.use("/v1/products", products);
app.use("/images", express.static('images'));

app.listen(port, function() {
	console.log("log server listing on port " + port);
});