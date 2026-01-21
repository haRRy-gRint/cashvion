CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    month DATE NOT NULL,
    monthly_budget NUMERIC(10,2) NOT NULL,
    savings_target NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_budget FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_month UNIQUE (user_id, month)
);
