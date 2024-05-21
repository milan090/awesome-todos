

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL
);

CREATE TYPE status_type as ENUM ('ALL', 'TODO', 'IN_PROGRESS', 'DONE');

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  due_date TIMESTAMP,
  status status_type NOT NULL DEFAULT 'TODO',
  next_id uuid REFERENCES todos(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (next_id) REFERENCES todos(id)

);