const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        try {
            const parsedData = JSON.parse(data.toString().trim()); // ✅ Parse JSON input
            const code = parsedData.code; // ✅ Extract only the code string

            const worker = new Worker(__filename, { workerData: code });

            worker.on("message", (msg) => console.log(JSON.stringify(msg)));
            worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));

        } catch (error) {
            console.error("⚠️ Error parsing JSON input:", error.message);
        }
    });
} else {
    try {
        let logOutput = [];
        console.log = (...args) => {
            logOutput.push(args.join(" "));
            parentPort.postMessage({ log: logOutput.join(" ") });
        };

        eval(workerData); // ✅ Run only the extracted JavaScript code
        parentPort.postMessage({ done: true });

    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}
