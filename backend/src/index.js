const express = require('express');
require('dotenv').config();
const cors = require('cors');
const http = require('http')
const WebSocket = require('ws')

const database = require('./config/database');
database.connect();

const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({port: 3003})


const port = process.env.PORT;
const router = require('./routes/client/index.route');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

wss.on('connection', (ws, req) => {
  console.log("Client connected:", req.socket.remoteAddress);

  ws.on('message', (message) => {
      console.log("Received:", message);
      ws.send(JSON.stringify({ response: "Hello from server!" }));
  });

  ws.on('close', () => console.log("Client disconnected"));
  
  ws.on('error', (err) => console.error("WebSocket error:", err));
});

module.exports.wss = wss;

router(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
