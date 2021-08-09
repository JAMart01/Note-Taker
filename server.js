const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');



// parses incoming data 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));



var notesArr = [];


// Default page upon going to the URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// Page returned upon clicking the get started button or going to /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// Returns the information from the our notes array 
app.get('/api/notes', (req, res) => {
    return res.json(notesArr);
});


// Adds a note to the db.json file
app.post('/api/notes', (req, res) => {

    const note = req.body;

    // Randomized note id to avoid repeated ids.
    note.id = notesArr.length.toString() + Math.floor(Math.random() * 999999999);

    notesArr.push(note);

    fs.writeFile('db/db.json', JSON.stringify(notesArr), (err) => {
        if (err){
            console.log(err);
            return;
        }
    });
    res.json(notesArr);
});
    

// Deletes a note from the db.json file
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("db/db.json", (err, data) => {

      let info = JSON.parse(data);
      let id = req.params.id;

      if (err) {
          console.log(err);
          return;
      } 

    notesArr = notesArr.filter((info) => {
        return info.id !== id;    
    });

    console.log(notesArr);
      
    fs.writeFile("db/db.json", JSON.stringify(notesArr), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });  

    res.json(notesArr);
    });
  });



// Listens on the port
app.listen(PORT, () => {
    console.log(`Listening to server on port ${PORT}`);
});