const path = require('path');
const express = require('express');
// const unZipper = require('./middlewear/unzip');
// const dummyRespsonse = require('./middlewear/callback.response');
const cors = require('cors');
const unZipRoutes = require('./routes/unzip.routes');
const fs = require('fs');
const http = require('http');
const { json } = require('express');
const app = express();

require('dotenv').config();

app.use(json());
app.use(cors());
if (!fs.existsSync(path.join(__dirname, '/uploads'))){
    fs.mkdirSync(path.join(__dirname, "uploads"));
}

app.use("/api/unzip", unZipRoutes);

const port = process.env.PORT || 8000;

app.listen(port, ()=>console.log("App listening on PORT: ", port));

