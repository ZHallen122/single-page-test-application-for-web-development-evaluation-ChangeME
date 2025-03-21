// Import necessary modules
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const db = new sqlite3.Database('./database.sqlite');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database initialization function
const initDatabase = () => {
    const schema = fs.readFileSync('./schema.sql', 'utf-8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error executing schema:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
};

// Initialize database on startup
initDatabase();

// User management
app.post('/api/users', (req, res) => {
    const { email, password, role } = req.body;
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    
    stmt.run(email, password, role, function (err) {
        if (err) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(201).json({ userId: this.lastID, email, role });
    });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Here you would typically sign a JWT token
        res.status(200).json({ token: 'JWT_TOKEN', user: { userId: user.id, email: user.email, role: user.role } });
    });
});

// Challenge management
app.get('/api/challenges', (req, res) => {
    const difficulty = req.query.difficulty;
    const sql = difficulty ? 'SELECT * FROM challenges WHERE difficultyLevel = ?' : 'SELECT * FROM challenges';
    
    db.all(sql, [difficulty], (err, challenges) => {
        if (err) {
            return res.status(404).json({ error: 'Challenges not found' });
        }
        res.status(200).json({ challenges });
    });
});

app.post('/api/challenges', (req, res) => {
    const { title, description, difficultyLevel, challengeData } = req.body;
    const stmt = db.prepare('INSERT INTO challenges (title, description, difficultyLevel, challengeData) VALUES (?, ?, ?, ?)');
    
    stmt.run(title, description, difficultyLevel, challengeData, function (err) {
        if (err) {
            return res.status(400).json({ error: 'Validation errors' });
        }
        res.status(201).json({ challengeId: this.lastID });
    });
});

// Code submission handling
app.post('/api/submissions', (req, res) => {
    const { userId, challengeId, code } = req.body;
    const stmt = db.prepare('INSERT INTO submissions (userId, challengeId, code) VALUES (?, ?, ?)');
    
    stmt.run(userId, challengeId, code, function (err) {
        if (err) {
            return res.status(400).json({ error: 'Submission errors' });
        }
        // Mockup for execution result and feedback
        const executionResult = 'Output of executed code';
        const feedback = {
            score: 85,
            messages: [{ type: 'info', text: 'Good job!' }],
        };
        res.status(201).json({ submissionId: this.lastID, executionResult, feedback });
    });
});

// Feedback retrieval
app.get('/api/feedback/:submissionId', (req, res) => {
    const { submissionId } = req.params;
    db.get('SELECT * FROM feedback WHERE submissionId = ?', [submissionId], (err, feedback) => {
        if (err || !feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});