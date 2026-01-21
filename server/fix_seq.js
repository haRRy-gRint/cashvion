const pool = require('./db');

async function fixSequence() {
    try {
        await pool.query("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) + 1 FROM users), 1), false);");
        console.log('Sequence fixed.');
        process.exit(0);
    } catch (err) {
        console.error('Error fixing sequence:', err);
        process.exit(1);
    }
}

fixSequence();
