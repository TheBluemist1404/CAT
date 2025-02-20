const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const { spawn } = require("child_process");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        try {
            const parsedData = JSON.parse(data.toString().trim());
            const { code, input } = parsedData; // ✅ Accept both `code` & `input`

            const worker = new Worker(__filename, { workerData: { code, input } });

            worker.on("message", (msg) => console.log(JSON.stringify(msg)));
            worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));

        } catch (error) {
            console.error("⚠️ Error parsing JSON input:", error.message);
        }
    });
} else {
    const { code, input } = workerData;

    // ✅ Run Python code dynamically with unbuffered output
    const python = spawn("python3", ["-u", "-c", code], { stdio: ["pipe", "pipe", "pipe"] });

    // ✅ Capture & send real-time logs
    python.stdout.on("data", (data) => {
        parentPort.postMessage({ log: data.toString().trim() });
    });

    // ✅ Capture & send errors
    python.stderr.on("data", (data) => {
        parentPort.postMessage({ error: data.toString().trim() });
    });

    // ✅ Notify when execution is done
    python.on("exit", () => {
        parentPort.postMessage({ done: true });
    });

    // ✅ Send user input to Python script
    if (input) {
        execution.stdin.write(input + '\n')
    }
    execution.stdin.end();
}
