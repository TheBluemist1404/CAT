const express = require('express');
require('dotenv').config();
const cors = require('cors');

const database = require('./config/database');
database.connect();

const app = express();
const port = process.env.PORT;
const router = require('./routes/client/index.route');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

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
