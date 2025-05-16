// backend.js - Node.js + Express + File-based Store for Render Deployment

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000; // Required for Render

const DATA_FILE = path.join(__dirname, 'latestData.json');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST endpoint for ESP32 to send data
app.post('/log', (req, res) => {
  const data = req.body;
  if (!data) return res.status(400).send('Invalid data');

  fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
    if (err) return res.status(500).send('Failed to store data');
    res.sendStatus(200);
  });
});

// GET endpoint for website to fetch latest data
app.get('/api/latest', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, json) => {
    if (err) return res.status(404).send('No data yet');
    res.header("Content-Type", 'application/json');
    res.send(json);
  });
});

// Serve static frontend from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
