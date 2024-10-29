const express = require('express');
const app = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // replace with your PostgreSQL username
    host: 'postgis',            // or your DB server address
    database: 'housenumber',    // replace with your database name
    password: '1234',    // replace with your PostgreSQL password
    port: 5432,                   // default PostgreSQL port
});

app.get('/api', (req, res) => {
    res.send('Hello World');
});

// Define the POST route to insert data
app.post('/api/insertdata', async (req, res) => {
    const { mncptname, moo, hno, lat, lng } = req.body;

    try {
        const query = 'INSERT INTO survey (mncptname, moo, hno, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [mncptname, moo, hno, lat, lng];

        const result = await pool.query(query, values);
        res.status(201).json({
            message: 'Data inserted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error inserting data', error);
        res.status(500).json({
            message: 'Error inserting data',
            error: error.message
        });
    }
});

// Define the GET route to retrieve data
app.get('/api/getdata', async (req, res) => {
    try {
        const query = 'SELECT * FROM survey';
        const result = await pool.query(query);

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: result.rows
        });
    } catch (error) {
        console.error('Error retrieving data', error);
        res.status(500).json({
            message: 'Error retrieving data',
            error: error.message
        });
    }
});


module.exports = app;