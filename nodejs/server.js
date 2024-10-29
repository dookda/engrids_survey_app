const express = require('express');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('www'));

// api
app.use('/', require('./service/api'));

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});