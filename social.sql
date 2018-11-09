DROP TABLE IF EXISTS users CASCADE;
-- by adding CASCADE, we delete table if other objects depend on it;
-- DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR (1000)
);

DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
id SERIAL PRIMARY KEY,
url VARCHAR (300),
user_id INT NOT NULL REFERENCES users(id)
);

DROP TABLE IF EXISTS friendships CASCADE;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR (1000)
);
