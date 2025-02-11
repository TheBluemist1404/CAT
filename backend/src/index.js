const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { spawn } = require("child_process");
const WebSocket = require('ws');

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;
const router = require('./routes/client/index.route');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const wss = new WebSocket.Server({ port: 3001 }); // ✅ WebSocket Server

const executions = {}; // Stores active WebSocket connections

// ✅ Sandbox mapping
const SANDBOXES = {
    javascript: "cat-sandbox-js",
    python: "cat-sandbox-python",
    cpp: "cat-sandbox-cpp",
};

// ✅ POST request to execute code
app.post("/execute", (req, res) => {
    const { code, language } = req.body;

    if (!code || !language || !SANDBOXES[language]) {
        return res.status(400).json({ error: "Invalid language or no code provided" });
    }

    const executionId = Date.now().toString(); // ✅ Unique ID for tracking logs
    executions[executionId] = []; // Store logs

    console.log(`🚀 Running ${language} sandbox for ID: ${executionId}`);

    // ✅ Run the appropriate sandbox container inside Docker
    const sandboxName = SANDBOXES[language];
    const process = spawn("docker", ["run", "--rm", "-i", sandboxName]);

    process.stdout.on("data", (data) => {
        const logs = data.toString().trim().split("\n"); // ✅ Produces an array of JSON strings
    
        logs.forEach((log) => {
            try {
                const parsedLog = JSON.parse(log); // ✅ Convert string to JSON object
                executions[executionId].push(parsedLog); // ✅ Store parsed object
                
                if (executions[executionId].ws) {
                    executions[executionId].ws.send(JSON.stringify(parsedLog)); // ✅ Send correct JSON format
                }
            } catch (error) {
                console.error("⚠️ Error parsing log JSON:", log);
            }
        });
    });
    
    process.stderr.on("data", (data) => {
        console.error("🚨 Error:", data.toString().trim());
        if (executions[executionId].ws) {
            executions[executionId].ws.send(JSON.stringify({ error: data.toString().trim() }));
        }
    });

    process.on("close", () => {
        console.log(`✅ Execution complete for ${language}.`);
        if (executions[executionId].ws) {
            executions[executionId].ws.send(JSON.stringify({ done: true }));
            executions[executionId].ws.close();
        }
        delete executions[executionId]; // Clean up
    });

    process.stdin.write(JSON.stringify({ code }) + "\n");
    process.stdin.end();

    // ✅ Return execution ID to the frontend
    res.json({ executionId });
});

// ✅ WebSocket connection for real-time logs
wss.on("connection", (ws, req) => {
    const executionId = req.url.split("/").pop(); // Extract executionId from URL

    if (!executions[executionId]) {
        ws.send(JSON.stringify({ error: "Execution not found" }));
        ws.close();
        return;
    }

    executions[executionId].ws = ws; // Store WebSocket connection

    console.log(`✅ WebSocket connected for execution ID: ${executionId}`);
});

router(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
