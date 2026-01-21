const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default DB first
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

async function createDatabase() {
    try {
        await client.connect();
        console.log('Connected to default postgres database.');

        // Check if database exists
        const checkRes = await client.query("SELECT 1 FROM pg_database WHERE datname = 'expense_tracker'");
        if (checkRes.rowCount === 0) {
            console.log('Creating database expense_tracker...');
            await client.query('CREATE DATABASE expense_tracker');
            console.log('Database created successfully.');
        } else {
            console.log('Database expense_tracker already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
