const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        const code = data.toString().trim();

        const worker = new Worker(`
            const { parentPort } = require('worker_threads');

            try {
                let logOutput = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    logOutput.push(args.join(" "));
                };

                eval(\`${code}\`); // Execute JS safely

                setTimeout(()=>{
                    parentPort.postMessage(
                    logOutput.length > 0 ? { logs: logOutput } : {});
                }, 1000)
            } catch (error) {
                parentPort.postMessage({ error: error.message });
            }
        `, { eval: true });

        worker.on("message", (msg) => {
            console.log(JSON.stringify(msg));
        });
    });
}
