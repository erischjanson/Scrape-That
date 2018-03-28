var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");


var PORT = process.env.PORT || 3000;

var app = express();

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Requiring our models for syncing
// var db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());



// Routes.

// Syncing sequelize models and then starting Express
// db.sequelize.sync().then(function () {
//     app.listen(PORT, function () {
//         console.log("App now listening at localhost:" + PORT);
//     });
// });

app.listen(PORT, function(){
    console.log("App now listening at localhost:" + PORT);
});