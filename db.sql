-- Active: 1757015436023@@127.0.0.1@5432@course_dashboard
-- Database Schema for Mini Course Dashboard

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Module Completion table
CREATE TABLE user_module_completion (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- Insert sample courses
INSERT INTO courses (title, description) VALUES
('Web Development Fundamentals', 'Learn the basics of web development including HTML, CSS, and JavaScript'),
('Advanced React Patterns', 'Master advanced React concepts and design patterns'),
('Backend with Node.js', 'Build scalable backend applications with Node.js and Express');

-- Insert sample modules
-- Course 1 modules
INSERT INTO modules (course_id, title, description, order_index) VALUES
(1, 'Introduction to HTML', 'Learn HTML basics and semantic markup', 1),
(1, 'Styling with CSS', 'Master CSS fundamentals and layouts', 2),
(1, 'JavaScript Basics', 'Get started with JavaScript programming', 3),
(1, 'Building Your First Website', 'Put it all together in a real project', 4),
(2, 'React Hooks Deep Dive', 'Understanding useState, useEffect, and custom hooks', 1),
(2, 'Context API and State Management', 'Managing global state in React applications', 2),
(2, 'Performance Optimization', 'Learn React.memo, useMemo, and useCallback', 3),
(3, 'Express.js Fundamentals', 'Setting up Express and creating routes', 1),
(3, 'Database Integration', 'Working with PostgreSQL and ORMs', 2),
(3, 'Authentication & Security', 'Implementing JWT and securing your API', 3),
(3, 'Deployment Strategies', 'Deploy your Node.js application', 4);