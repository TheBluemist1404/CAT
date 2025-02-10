const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        const code = data.toString().trim();

        const worker = new Worker(`
            const { parentPort } = require('worker_threads');

            try {
                const originalLog = console.log;
                console.log = (...args) => {
                    const logMessage = args.join(" ");
                    parentPort.postMessage({ log: logMessage }); // ✅ Send logs immediately
                };

                eval(\`${code}\`); // ✅ Execute user code safely

            } catch (error) {
                parentPort.postMessage({ error: error.message });
            }
        `, { eval: true });

        worker.on("message", (msg) => {
            console.log(JSON.stringify(msg));
        });

        worker.on("error", (err) => {
            console.error("🚨 Worker Thread Error:", err.message);
        });

        worker.on("exit", (code) => {
            if (code !== 0) {
                console.error(`🚨 Worker stopped with exit code ${code}`);
            }
        });
    });
}
