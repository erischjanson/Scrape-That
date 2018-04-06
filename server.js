var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoHeadlines", {
  useMongoClient: true
});

// Routes

app.get("/scrape", function(req, res){
  console.log("first get");

  axios.get("http://www.lemonde.fr").then(function(response){

    var $ = cheerio.load(response.data);

    $("article").each(function(i, element){

      var result = {};

      result.title = $(this).find("h2").text();
      console.log(result.title);
      // result.summary = (this).children("h2").children("p").text();
      // result.link = $(this).children("h2").children("a").attr("href");
    
    //scraaaaaaaape here

    //create new headline entry
    db.Headline.create(result)
    .then(function(dbHeadline){
      console.log(dbHeadline);
    })
    .catch(function(error){
      return res.json(error)
    });
  });


    res.send("Scrape completed");
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
