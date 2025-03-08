// const { spawn } = require("child_process");
// const WebSocket = require('ws');


// const wssExecute = new WebSocket.Server({ port: 3001 }); // ✅ WebSocket Server

// const executions = {}; // Stores active WebSocket connections

// // ✅ Sandbox mapping
// const SANDBOXES = {
//   javascript: "cat-sandbox-js",
//   python: "cat-sandbox-python",
//   cpp: "cat-sandbox-cpp",
// };

// // POST api/v1/code/execute
// module.exports.execute = (req, res) => {
//   const { code, input, language } = req.body;

//   if (!code || !language || !SANDBOXES[language]) {
//     return res.status(400).json({ error: "Invalid language or no code provided" });
//   }

//   const executionId = Date.now().toString(); // ✅ Unique ID for tracking logs
//   executions[executionId] = []; // Store logs

//   console.log(`🚀 Running ${language} sandbox for ID: ${executionId}`);

//   // ✅ Run the appropriate sandbox container inside Docker
//   const sandboxName = SANDBOXES[language];
//   const process = spawn("docker", ["run", "--rm", "-i", sandboxName]);

//   process.stdout.on("data", (data) => {
//     const logs = data.toString().trim().split("\n"); // ✅ Produces an array of JSON strings

//     logs.forEach((log) => {
//       try {
//         const parsedLog = JSON.parse(log); // ✅ Convert string to JSON object
//         executions[executionId].push(parsedLog); // ✅ Store parsed object
//         console.log(parsedLog)

//         if (executions[executionId].ws) {
//           executions[executionId].ws.send(JSON.stringify(parsedLog)); // ✅ Send correct JSON format
//         }
//       } catch (error) {
//         console.error("⚠️ Error parsing log JSON:", log);
//       }
//     });
//   });

//   process.stderr.on("data", (data) => {
//     console.error("🚨 Error:", data.toString().trim());
//     if (executions[executionId].ws) {
//       executions[executionId].ws.send(JSON.stringify({ error: data.toString().trim() }));
//     }
//   });

//   process.on("close", () => {
//     console.log(`✅ Execution complete for ${language}.`);
//     if (executions[executionId].ws) {
//       executions[executionId].ws.send(JSON.stringify({ done: true }));
//       executions[executionId].ws.close();
//     }
//     delete executions[executionId]; // Clean up
//   });
  
//   process.stdin.write(JSON.stringify({ code, input }) + "\n");
//   process.stdin.end();

//   // ✅ Return execution ID to the frontend
//   res.json({ executionId });
// }

// // ✅ WebSocket connection for real-time logs
// wssExecute.on("connection", (ws, req) => {
//   const executionId = req.url.split("/").pop(); // Extract executionId from URL

//   if (!executions[executionId]) {
//     ws.send(JSON.stringify({ error: "Execution not found" }));
//     ws.close();
//     return;
//   }

//   executions[executionId].ws = ws; // Store WebSocket connection

//   console.log(`✅ WebSocket connected for execution ID: ${executionId}`);
// });

// backend/codeExecution.js
const axios = require("axios");

// In-memory storage for active executions.
// Each execution stores an array of logs and, once connected, the SSE response object.
const executions = {};

/**
 * Handles code execution requests.
 * Expects req.body: { code, input, language }
 * Forwards the code to the appropriate sandbox and returns an executionId.
 */
module.exports.execute = async (req, res) => {
  const { code, input, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "Invalid language or no code provided" });
  }

  // Create a unique executionId.
  const executionId = Date.now().toString();
  executions[executionId] = { logs: [] };

  // Map language to the sandbox service URL.
  const sandboxUrls = {
    javascript: "http://localhost:3001/execute",
    python: "http://sandbox-python:3000/execute",
    cpp: "http://sandbox-cpp:3000/execute",
  };

  const sandboxUrl = sandboxUrls[language];
  if (!sandboxUrl) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  // Forward the code to the sandbox.
  // For this demo, we assume the sandbox streams SSE responses.
  // In production you might have the sandbox POST log messages back to BE.
  console.log("lets send the code to sandbox")
  axios
    .post(sandboxUrl, { code, input })
    .catch((error) => {
      console.error("Error forwarding to sandbox:", error.message);
      module.exports.pushLog(executionId, { error: error.message });
    });

  // Respond immediately with the executionId.
  return res.json({ executionId });
};

/**
 * SSE endpoint for FE to receive logs.
 * FE connects to GET /api/v1/code/logs/:executionId.
 */
module.exports.streamLogs = (req, res) => {
  console.log("stream logs")
  const { executionId } = req.params;
  if (!executions[executionId]) {
    return res.status(404).json({ error: "Execution not found" });
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send any logs that have been buffered so far.
  executions[executionId].logs.forEach((log) => {
    console.log("log: ", log)
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  });

  // Save the SSE response so that new logs can be streamed immediately.
  executions[executionId].sseRes = res;
};

/**
 * Endpoint for receiving log messages from the sandbox (or intermediary).
 * Expects req.body: { executionId, log }
 */
module.exports.pushLogEndpoint = (req, res) => {
  const { executionId, log } = req.body;
  if (!executionId || !log) {
    return res.status(400).json({ error: "Missing executionId or log" });
  }
  module.exports.pushLog(executionId, log);
  res.json({ status: "ok" });
};

/**
 * Helper: Push a log entry into an execution and, if an SSE connection exists, stream it.
 */
module.exports.pushLog = (executionId, log) => {
  if (!executions[executionId]) return;
  executions[executionId].logs.push(log);
  if (executions[executionId].sseRes) {
    executions[executionId].sseRes.write(`data: ${JSON.stringify(log)}\n\n`);
  }
};
