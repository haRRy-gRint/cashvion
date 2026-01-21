CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, email, password_hash)
VALUES (1, 'default_user', 'default@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF')
ON CONFLICT (id) DO NOTHING;

-- We will handle constraint addition in the node script or just attempt it
