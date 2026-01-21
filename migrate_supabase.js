const fs = require('fs');
const path = require('path');
const pool = require('./server/db');

async function migrate() {
    try {
        console.log('Starting Supabase Migration...');

        // 1. Transactions Schema (Base)
        console.log('Applying: database.sql');
        const schema = fs.readFileSync(path.join(__dirname, 'server', 'database.sql'), 'utf8');
        await pool.query(schema);

        // 2. Auth Schema (Users)
        console.log('Applying: auth_schema.sql');
        const authSchema = fs.readFileSync(path.join(__dirname, 'server', 'auth_schema.sql'), 'utf8');
        await pool.query(authSchema);

        // 3. Budget Schema (Budgets)
        console.log('Applying: budget_schema.sql');
        const budgetSchema = fs.readFileSync(path.join(__dirname, 'server', 'budget_schema.sql'), 'utf8');
        await pool.query(budgetSchema);

        console.log('✅ Migration Complete! Supabase is ready.');
    } catch (err) {
        console.error('Migration Failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
