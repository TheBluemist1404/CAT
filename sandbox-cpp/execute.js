const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const { spawn, execSync } = require("child_process");
const fs = require("fs");

if (isMainThread) {
    process.stdin.on("data", (data) => {
        const parsedData = JSON.parse(data.toString().trim()); // ✅ Parse JSON input
        const { code, input } = parsedData; // ✅ Extract code

        const worker = new Worker(__filename, { workerData: { code, input } });

        worker.on("message", (msg) => console.log(JSON.stringify(msg)));
        worker.on("error", (err) => console.error(JSON.stringify({ error: err.message })));
    });
} else {
    const { code, input } = workerData;
    const filename = "/tmp/code.cpp";
    const outputBinary = "/tmp/code.out";

    // ✅ Write user's original code to file
    fs.writeFileSync(filename, code);

    // ✅ Read the file, modify it, and then write it back
    fs.readFile(filename, "utf8", (err, data) => {

        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // ✅ Insert `setbuf(stdout, NULL);` inside `main()`
        const modifiedContent = data.replace(
            "int main() {",
            "int main() {\n    setbuf(stdout, NULL);"
        );

        // ✅ Write the modified content back to the file
        fs.writeFile(filename, modifiedContent, (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }

            try {
                // ✅ Compile the modified C++ file
                execSync(`g++ ${filename} -o ${outputBinary} -std=c++17`);

                // ✅ Run the compiled C++ program
                const execution = spawn(outputBinary, [], { stdio: ["pipe", "pipe", "pipe"] });

                execution.stdout.on("data", (data) => {
                    parentPort.postMessage({ log: data.toString().trim() });
                });

                execution.stderr.on("data", (data) => {
                    parentPort.postMessage({ error: data.toString().trim() });
                });

                execution.on("exit", () => {
                    parentPort.postMessage({done: true})
                });
                
                if (input) {
                    execution.stdin.write(input + '\n')
                }
                execution.stdin.end();
                

            } catch (error) {
                parentPort.postMessage({ error: "Compilation failed" });
            }
        });
    });
}
