// const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
// const vm = require("vm");

// if (isMainThread) {
//     process.stdin.on("data", (data) => {
//         try {
//             const parsedData = JSON.parse(data.toString().trim());
//             const code = parsedData.code;

//             const worker = new Worker(__filename, { workerData: code });

//             worker.on("message", (msg) => console.log(JSON.stringify(msg)));
//             worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));

//         } catch (error) {
//             console.error("⚠️ Error parsing JSON input:", error.message);
//         }
//     });
// } else {
//     try {
//         // ✅ Secure the execution environment with a sandbox
//         const sandbox = {
//             global: global, ...global,
//             console: {
//                 log: (...args) => {
//                     const logMessage = args.join(" ");
//                     parentPort.postMessage({ log: logMessage });
//                 }
//             },
//             require: require, // ✅ Allow `require()` for CommonJS modules
//         };

//         const context = vm.createContext(sandbox); // ✅ Create secure execution context

//         // ✅ Execute the user code safely
//         new vm.Script(workerData).runInContext(context);

//     } catch (error) {
//         parentPort.postMessage({ error: error.message });
//     }
// }

// sandbox/execute.js
const express = require('express');
const cors = require('cors');
const vm = require('vm');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// POST /execute: Execute code and stream logs via SSE.
app.post('/execute', (req, res) => {
  console.log("begin execution")
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const { code } = req.body;
  if (!code) {
    res.write(`data: ${JSON.stringify({ error: "No code provided" })}\n\n`);
    return res.end();
  }

  try {
    // Create a sandbox with a custom console.log that streams logs
    const sandbox = {
      console: {
        log: (...args) => {
          const logMessage = args.join(" ");
          console.log(logMessage);
          res.write(`data: ${JSON.stringify({ log: logMessage })}\n\n`);
        }
      },
      require,
      global,
    };

    const context = vm.createContext(sandbox);
    new vm.Script(code).runInContext(context);

    // Signal completion.
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Sandbox listening on port ${PORT}`));

