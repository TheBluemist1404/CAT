const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const { spawn } = require("child_process");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        const parsedData = JSON.parse(data.toString().trim()); // ✅ Parse JSON input
        const code = parsedData.code; // ✅ Extract only the code string

        const worker = new Worker(__filename, { workerData: code });

        worker.on("message", (msg) => console.log(JSON.stringify(msg)));
        worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));
    });
} else {
    const python = spawn("python3", ["-c", workerData]);

    python.stdout.on("data", (data) => {
        parentPort.postMessage({ log: data.toString().trim() });
    });

    python.stderr.on("data", (data) => {
        parentPort.postMessage({ error: data.toString().trim() });
    });

    python.on("exit", () => {
        parentPort.postMessage({ done: true });
    });
}
