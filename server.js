// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");

// Set up the Express App
var app = express();

// Allow for Heroku deployment and add a port for local deployment
var PORT = process.env.PORT || 3000;

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
  
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                data: null,
                message: "Unable to retrieve notes."
            });
        }
    });
});

// POST route
app.post("/api/notes", function(req, res) {
    console.log(req.body);
    if (!req.body.title || !req.body.text) {
        return res.status(400).json({
            error: true,
            data: null,
            message: "Invalid note.  Please reformat and try again."
        })
    }
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                data: null,
                message: "Unable to retrieve note."
            });
        }
        console.log(data);
        const updatedData = JSON.parse(data);
        updatedData.push(req.body);
        console.log(updatedData);
        fs.writeFile("./db/db.json", JSON.stringify(updatedData), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                    data: null,
                    message: "Unable to save new note."
                });
            }
            res.json({
                error: false,
                data: null,
                message: "Successfully added new note."
            });
        });
    });
});

// Start the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });