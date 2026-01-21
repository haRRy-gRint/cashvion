const pool = require('./server/db');

async function checkData() {
    try {
        console.log('--- ALL TRANSACTIONS ---');
        const res = await pool.query('SELECT id, user_id, amount, description, account_type FROM transactions ORDER BY id DESC');
        console.table(res.rows);

        console.log('--- USERS ---');
        const users = await pool.query('SELECT id, email FROM users');
        console.table(users.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkData();
