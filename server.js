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
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with request
//   axios.get("http://www.echojs.com/").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//         console.log("RESULT", result);

//       // Create a new Article using the `result` object built from scraping
//       db.Headline.create(result)
//         .then(function(dbHeadline) {
//           // View the added result in the console
//           console.log("DBHEADLINE", dbHeadline);
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           return res.json(err);
//         });
//     });

//     // If we were able to successfully scrape and save an Article, send a message to the client
//     res.send("Scrape Complete");
//   });
// });
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
