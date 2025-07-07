-- Initialize Hydra Calendar Database
-- This file sets up the initial database structure and sample data

-- Create events table if not exists
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    room VARCHAR(50),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    recurrence_pattern VARCHAR(255), -- e.g., "Mon,Wed,Fri"
    semester VARCHAR(50), -- e.g., "Spring 2025"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    role VARCHAR(50) DEFAULT 'student', -- TA, Professor, Student
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start_end_time ON events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_events_semester ON events(semester);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample events for demonstration
INSERT IGNORE INTO events (title, description, room, start_time, end_time, recurrence_pattern, semester) VALUES
('CS 101 Lab Session', 'Introduction to Computer Science lab session covering basic programming concepts.', 'Lab A', '2025-07-07 09:00:00', '2025-07-07 11:00:00', 'Mon,Wed,Fri', 'Spring 2025'),
('Office Hours - Dr. Smith', 'Office hours for Computer Science students.', 'Room 204', '2025-07-08 14:00:00', '2025-07-08 16:00:00', 'Tue,Thu', 'Spring 2025'),
('Database Systems Lecture', 'Advanced database concepts and SQL optimization.', 'Lecture Hall B', '2025-07-09 10:00:00', '2025-07-09 11:30:00', 'Mon,Wed,Fri', 'Spring 2025'),
('Math Tutoring Session', 'Calculus and Statistics tutoring available.', 'Math Center', '2025-07-10 13:00:00', '2025-07-10 15:00:00', 'Mon,Tue,Wed,Thu,Fri', 'Spring 2025'),
('Student Study Group', 'Collaborative study session for midterm preparation.', 'Library Room 101', '2025-07-11 16:00:00', '2025-07-11 18:00:00', '', 'Spring 2025'),
('Programming Workshop', 'Hands-on workshop covering React and Laravel development.', 'Computer Lab 2', '2025-07-13 11:00:00', '2025-07-13 13:00:00', '', 'Spring 2025');
