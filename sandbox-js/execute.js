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
        const originalLog = console.log; //Store orignal console.log, we gonna overwrite it
        console.log = (...args) => {
            const logMessage = args.join(" ");
            console.log(logMessage)
            parentPort.postMessage({ log: logMessage }); // ✅ Send logs immediately
        };

        eval(workerData); // ✅ Run only the extracted JavaScript code

    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}
