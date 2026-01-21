const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'auth_schema.sql')).toString();

        // Run main creation
        await pool.query(sql);
        console.log('Users table created/verified.');

        // Try adding constraint
        try {
            await pool.query(`
               ALTER TABLE transactions 
               ADD CONSTRAINT fk_user 
               FOREIGN KEY (user_id) REFERENCES users(id) 
               ON DELETE CASCADE
           `);
            console.log('Foreign key constraint added.');
        } catch (err) {
            // Ignore if it already exists (Postgres error 42710 usually)
            if (err.code === '42710') {
                console.log('Foreign key constraint already exists.');
            } else {
                console.log('Note: Constraint might not have been added (or already exists):', err.message);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
