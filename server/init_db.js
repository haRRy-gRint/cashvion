const pool = require('./db');
const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString();

pool.query(sql, (err, res) => {
    if (err) {
        console.error('Error executing SQL', err);
        process.exit(1);
    } else {
        console.log('Database initialized successfully');
        process.exit(0);
    }
});
