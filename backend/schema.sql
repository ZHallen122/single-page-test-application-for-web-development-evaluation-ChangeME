CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('User', 'Admin')) NOT NULL,
  achievements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS challenges (
  challenge_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) CHECK(difficulty_level IN ('Easy', 'Medium', 'Hard')) NOT NULL,
  challenge_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenges_title ON challenges(title);

CREATE TABLE IF NOT EXISTS code_submissions (
  submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  challenge_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  execution_result TEXT,
  time_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_code_submissions_user_id ON code_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_challenge_id ON code_submissions(challenge_id);

CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  score INTEGER NOT NULL CHECK(score >= 0),
  feedback_messages TEXT,
  FOREIGN KEY (submission_id) REFERENCES code_submissions(submission_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_submission_id ON feedback(submission_id);