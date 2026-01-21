CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    txn_date DATE NOT NULL,
    account_type VARCHAR(10) CHECK (account_type IN ('public', 'private')) NOT NULL
);
