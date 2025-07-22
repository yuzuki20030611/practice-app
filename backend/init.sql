CREATE TABLE IF NOT EXISTS cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    personality VARCHAR(200) NOT NULL,
    origin VARCHAR(100),
    age INTEGER CHECK (age >= 0 AND age <= 30),
    color VARCHAR(50),
    weight DECIMAL(4,1) CHECK (weight >= 0 AND weight <= 20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);