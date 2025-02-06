const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { spawn } = require("child_process");

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;
const router = require('./routes/client/index.route');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/execute", (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Run the JavaScript code securely inside Docker using stdin
  const process = spawn("docker", ["run", "--rm", "-i", "secure-js-sandbox"]);

  let output = "";
  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error("Error:", data.toString());
  });

  process.on("close", () => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Invalid output format" });
    }
  });

  // Send code to container via stdin
  process.stdin.write(code + "\n");
  process.stdin.end();
});

router(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
// const options = {
//   redirect_uri: process.env.REDIRECT_URI,
//   client_id: process.env.CLIENT_ID,
//   access_type: 'offline',
//   response_type: 'code',
//   prompt: 'consent',
//   scope: [
//     'https://www.googleapis.com/auth/userinfo.profile',
//     'https://www.googleapis.com/auth/userinfo.email',
//   ].join(' '),
// };
// const qs = new URLSearchParams(options);
// console.log(`${rootURL}?${qs.toString()}`);
