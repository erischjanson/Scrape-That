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

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

//Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// require("./routes/api/api-routes.js")(app);
// require("./routes/view/html-routes.js")(app);

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  //   useMongoClient: true 
  });
// mongoose.connect("mongodb://localhost/mongoHeadlines", {
//   useMongoClient: true
// });

// Routes

// app.get("/", function(req, res){
//   res.render("home");
// });

app.get("/", function(req, res){
  db.Headline.find({})
  .then(function(dbHeadline){
    return res.render("home", {headline: dbHeadline});
    console.log(dbHeadline);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.get("/scrape", function(req, res){
  console.log("first get");

  axios.get("http://www.lemonde.fr").then(function(response){

    var $ = cheerio.load(response.data);

    $("article.grid_6").each(function(i, element){

      var result = {};

      result.title = $(this).find("h2").text();
      // console.log(result.title);
      result.summary = $(this).children("p").text();
      result.link = $(this).children("a").attr("href");
      // console.log(result.link);
    
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

    res.redirect("/");
    // res.send("Scrape completed");
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
