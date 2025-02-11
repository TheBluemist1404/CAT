const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const { spawn, execSync } = require("child_process");
const fs = require("fs");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        const parsedData = JSON.parse(data.toString().trim()); // ✅ Parse JSON input
        const code = parsedData.code; // ✅ Extract only the code string

        const worker = new Worker(__filename, { workerData: code });

        worker.on("message", (msg) => console.log(JSON.stringify(msg)));
        worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));
    });
} else {
    const filename = "/tmp/code.cpp";
    const outputBinary = "/tmp/code.out";

    fs.writeFileSync(filename, workerData);

    try {
        execSync(`g++ ${filename} -o ${outputBinary}`);

        const execution = spawn(outputBinary);
        execution.stdout.on("data", (data) => {
            parentPort.postMessage({ log: data.toString().trim() });
        });

        execution.stderr.on("data", (data) => {
            parentPort.postMessage({ error: data.toString().trim() });
        });

        execution.on("exit", () => {
            parentPort.postMessage({ done: true });
        });
    } catch (error) {
        parentPort.postMessage({ error: "Compilation failed" });
    }
}
