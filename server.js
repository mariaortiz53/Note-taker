//dependencies 
const fs = require('fs');
const express = require('express');
const path = require('path');

//Set the express App
const app = express();

//Set the port for listening (3001)
const PORT = process.env.PORT || 3001;

//Connect css, javascript and images from public folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Route to the notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Route to the main page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//route to the db.json file
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
})

//Return all saved notes as json and read db.json
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteLength = (noteList.length).toString();


    //Create ID property
    newNote.id = noteLength;
    noteList.push(newNote);

    //Write updated data
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

//Delete note with the specfic ID
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    //only add those without a matching ID and delete the ones with a matching id 
    noteList = noteList.filter(selected => {
        return selected.id !=noteId;
    })

    //Write the updated data on the db.json and show the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

//Deploy on the port 
app.listen(PORT, () => console.log("Server listening on port" + PORT));