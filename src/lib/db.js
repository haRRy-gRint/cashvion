import { Pool } from 'pg';

let pool;

const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, // For some cloud providers
        },
    }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'expense_tracker',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    };

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(config);
} else {
  // In development mode, stick the pool in a global variable
  // so we don't restart it every time the module reloads.
  if (!global.pool) {
    console.log('[DB] Initializing new pool (dev)');
    global.pool = new Pool(config);
  }
  pool = global.pool;
}

export default pool;
