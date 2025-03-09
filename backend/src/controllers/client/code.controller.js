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
// backend/codeExecution.js
const axios = require('axios');

// In-memory storage for active executions.
const executions = {};

/**
 * Executes code by forwarding it to the sandbox.
 * FE sends a POST request with { code, input, language }.
 * BE generates an executionId, forwards code (with executionId) to the sandbox,
 * and immediately returns the executionId to FE.
 */
module.exports.execute = async (req, res) => {
  const { code, input, language } = req.body;
  if (!code || !language) {
    return res
      .status(400)
      .json({ error: 'Invalid language or no code provided' });
  }

  // Generate a unique executionId.
  const executionId = Date.now().toString();
  executions[executionId] = { logs: [] };

  // Map language to sandbox URL.
  const sandboxUrls = {
    javascript: 'https://sandbox-js.fly.dev/execute', // adjust as needed
    python: 'http://localhost:2995/execute',
    cpp: 'http://localhost:2996/execute',
  };

  const sandboxUrl = sandboxUrls[language];
  if (!sandboxUrl) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  // Forward code to the sandbox, including executionId.
  axios.post(sandboxUrl, { code, input, executionId }).catch(error => {
    console.error('Error forwarding to sandbox:', error.message);
    module.exports.pushLog(executionId, { error: error.message });
  });

  // Return the executionId immediately.
  return res.json({ executionId });
};

/**
 * SSE endpoint for FE to receive logs.
 * FE connects to GET /api/v1/code/logs/:executionId.
 */
module.exports.streamLogs = (req, res) => {
  console.log('stream logs');
  const { executionId } = req.params;
  if (!executions[executionId]) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send buffered logs.
  executions[executionId].logs.forEach(log => {
    console.log('sending log: ', log);
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  });

  // Store the SSE response object for real-time updates.
  executions[executionId].sseRes = res;
};

/**
 * Endpoint for sandbox to push log messages.
 * Expects req.body: { executionId, log }.
 */
module.exports.pushLogEndpoint = (req, res) => {
  const { executionId, log } = req.body;
  if (!executionId || !log) {
    return res.status(400).json({ error: 'Missing executionId or log' });
  }
  module.exports.pushLog(executionId, log);
  return res.json({ status: 'ok' });
};

/**
 * Helper function to push a log entry.
 */
module.exports.pushLog = (executionId, log) => {
  console.log('pushing logs');
  if (!executions[executionId]) return;
  executions[executionId].logs.push(log);
  if (executions[executionId].sseRes) {
    executions[executionId].sseRes.write(`data: ${JSON.stringify(log)}\n\n`);
  }
};
