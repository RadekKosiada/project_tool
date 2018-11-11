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

DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR (1000)
);

DROP TABLE IF EXISTS spaces CASCADE;

CREATE TABLE spaces(
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    category VARCHAR(255),
    color VARCHAR(255),
    eta INT
);

DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id),
    editor_id INT REFERENCES users(id),
    space_id INT NOT NULL REFERENCES spaces(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    task VARCHAR(1000) NOT NULL,
    status VARCHAR(255),
    category VARCHAR(255),
    color VARCHAR(255),
    eta INT
);

DROP TABLE IF EXISTS permissions CASCADE;

CREATE TABLE permissions(
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id),
    contributor_id INT NOT NULL REFERENCES users(id),
    space_id INT NOT NULL REFERENCES spaces(id)
);
