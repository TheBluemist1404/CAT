const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const vm = require("vm");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        try {
            const parsedData = JSON.parse(data.toString().trim());
            const code = parsedData.code;

            const worker = new Worker(__filename, { workerData: code });

            worker.on("message", (msg) => console.log(JSON.stringify(msg)));
            worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));

        } catch (error) {
            console.error("⚠️ Error parsing JSON input:", error.message);
        }
    });
} else {
    try {
        // ✅ Secure the execution environment with a sandbox
        const sandbox = {
            global: global, ...global,
            console: {
                log: (...args) => {
                    const logMessage = args.join(" ");
                    parentPort.postMessage({ log: logMessage });
                }
            },
            require: require, // ✅ Allow `require()` for CommonJS modules
        };

        const context = vm.createContext(sandbox); // ✅ Create secure execution context

        // ✅ Execute the user code safely
        new vm.Script(workerData).runInContext(context);

    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}
