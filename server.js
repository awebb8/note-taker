// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
const {v4: uuidv4} = require("uuid");

// Set up the Express App
var app = express();

// Allow for Heroku deployment and add a port for local deployment
var PORT = process.env.PORT || 3000;


// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Get existing notes
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
        res.json(JSON.parse(data));
    });
});

// POST route
app.post("/api/notes", function(req, res) {
    console.log(req.body);
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
        req.body.id = uuidv4();
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
            res.json(updatedData);
        });
    });
});

// Delete a note
app.delete("/api/notes/:id", function(req, res) {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                data: null,
                message: "Unable to retrieve note."
            });
        }
        const updatedData = (JSON.parse(data)).filter(function(data) {
            return data.id != req.params.id;
        });
        console.log(updatedData);
        fs.writeFile("./db/db.json", JSON.stringify(updatedData), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                    data: null,
                    message: "Unable to delete note."
                });
            }
            res.json(updatedData);
        });
    });
});


// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
// Route that sends user to the notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});