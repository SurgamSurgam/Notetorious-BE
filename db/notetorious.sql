DROP TABLE  IF EXISTS taggings;
DROP TABLE IF EXISTS tags ;
DROP TABLE  IF EXISTS notes;
DROP TABLE  IF EXISTS notebooks;
DROP TABLE  IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR (50) NOT NULL UNIQUE,
  email VARCHAR (355) NOT NULL UNIQUE,
  password_digest VARCHAR (355) NOT NULL,
  profile_pic VARCHAR
);

CREATE TABLE notebooks (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR (50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR (50) NOT NULL UNIQUE,
  body VARCHAR (2000) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  author_id INT REFERENCES users(id) ON DELETE CASCADE,
  notebook_id INT REFERENCES notebooks(id) ON DELETE CASCADE,
  favorited BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL UNIQUE
);

CREATE TABLE taggings (
  id SERIAL PRIMARY KEY,
  note_id INT REFERENCES notes(id),
  tag_id INT REFERENCES tags(id) ON DELETE CASCADE
);

INSERT INTO users(username, email, password_digest, profile_pic) VALUES ('Clark Kent', 'kent@super.com', '$2a$10$XhmVGRJ6y26q6GGP7Dcicudow2FygRu.j0T.sD4N2B2BzGwjHLwlu', 'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-Y5ZwCqAT6m0%2FTzVcYOE0X4I%2FAAAAAAAAI30%2FsQJFzBftSxM%2Fs400%2Fclark-kent-and-superman.jpg&f=1');

INSERT INTO notebooks(author_id, title, is_default) VALUES (1, 'Metropolis', TRUE);

INSERT INTO notes(title, body, author_id, notebook_id, favorited) VALUES ('Daily Planet', 'Clark Joseph Kent is a fictional character appearing in American comic books published by DC Comics. Created by Jerry Siegel and Joe Shuster, he debuted in Action Comics #1 (June 1938) and serves as the civilian and secret identity of the superhero Superman.', 1, 1, TRUE);

INSERT INTO tags(name) VALUES ('superhero');

INSERT INTO taggings(note_id, tag_id) VALUES (1, 1);
