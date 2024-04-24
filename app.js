const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.post('/save-event', (req, res) => {
    const data = req.body;
    const org = fs.readFileSync('public/events.json');
    const jsonorg = JSON.parse(org);
    jsonorg.push(data);
    const jsonString = JSON.stringify(jsonorg);
    fs.writeFile('public/events.json', jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving event');
            return;
        }
        console.log('Event saved successfully!');
        res.status(200).send('Event saved successfully');
    });
});

app.post('/add-personal', (req, res) => {
    const data = req.body;
    const name = req.get('X-Name');
    const targetFileName = 'public/' + name + '.json'
    const org = fs.readFileSync(targetFileName);
    const jsonorg = JSON.parse(org);
    jsonorg.push(data);
    const jsonString = JSON.stringify(jsonorg);
    // console.log(targetFileName)
    // console.log(jsonString)
    fs.writeFile(targetFileName, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving event');
            return;
        }
        console.log('Event saved successfully!');
        res.status(200).send('Event saved successfully');
    });
});

app.post('/save-personal', (req, res) => {
    const data = req.body;
    const jsonString = JSON.stringify(data);
    const name = req.get('X-Name');
    const targetFileName = 'public/' + name + '.json'
    fs.writeFile(targetFileName, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving event');
            return;
        }
        console.log('Event saved successfully!');
        res.status(200).send('Event saved successfully');
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
