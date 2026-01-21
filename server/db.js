const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const isProduction = !!process.env.DATABASE_URL;
console.log(`[DB] Connecting to: ${isProduction ? 'Supabase (Remote)' : 'Local PostgreSQL'}`);
if (isProduction) console.log(`[DB] URL: ${process.env.DATABASE_URL.split('@')[1]}`); // Log host only for safety

const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'expense_tracker',
            password: process.env.DB_PASSWORD || 'password',
            port: process.env.DB_PORT || 5432,
        }
);

module.exports = pool;
