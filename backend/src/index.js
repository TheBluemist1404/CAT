const express = require("express");
require('dotenv').config();
const cors = require("cors");

const database = require("./config/database"); 
database.connect();

const app = express();
const port = process.env.PORT;
const router = require("./routes/client/index.route");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

router(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

