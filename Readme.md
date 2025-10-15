# Mini Course Dashboard

A full-stack teaching platform built with MERN Stack + TypeScript + PostgreSQL where users can view courses, track progress, and mark modules as completed.

## 🚀 Features

### Core Features

- ✅ User Authentication (Register/Login with hashed passwords)
- ✅ Course Dashboard with progress tracking
- ✅ Module completion tracking
- ✅ Progress percentage calculation per course
- ✅ Responsive, clean UI design

### Extra Credit Features

- ✅ "Mark All as Completed" button for courses
- ✅ Filter courses by completion status (All, In Progress, Completed, Not Started)

## 🛠️ Tech Stack

**Backend:**

- Node.js + Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**

- React 18
- TypeScript
- React Router v6
- Axios
- Tailwind CSS
- Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Setup Instructions

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb course_dashboard

# Or using psql
psql -U postgres
CREATE DATABASE course_dashboard;
\q

# Run the schema SQL file
psql -U postgres -d course_dashboard -f database/schema.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=course_dashboard
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
EOF

# Build TypeScript
npm run build

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults to localhost:5000)
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
mini-course-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # PostgreSQL connection
│   │   │   └── jwt.ts            # JWT configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts # Auth logic
│   │   │   └── courseController.ts # Course logic
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verification
│   │   │   └── errorHandler.ts   # Error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.ts     # Auth endpoints
│   │   │   └── courseRoutes.ts   # Course endpoints
│   │   └── server.ts             # Express app
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   └── CourseDetail.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state management
│   │   ├── services/
│   │   │   └── api.ts            # API calls
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── database/
    └── schema.sql                # Database schema
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses (Protected)

- `GET /api/courses` - Get all courses with progress
- `GET /api/courses/:courseId` - Get course details with modules
- `POST /api/courses/modules/:moduleId/complete` - Mark module as complete
- `DELETE /api/courses/modules/:moduleId/complete` - Mark module as incomplete
- `POST /api/courses/:courseId/complete-all` - Mark all course modules as complete

## 💾 Database Schema

### Tables

- **users** - User accounts
- **courses** - Course information
- **modules** - Course modules
- **user_module_completion** - Tracks module completion per user

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **View Dashboard**: See all available courses with progress
3. **Filter Courses**: Use filter buttons to view courses by status
4. **View Course Details**: Click on a course to see its modules
5. **Complete Modules**: Click checkboxes to mark modules as complete
6. **Mark All Complete**: Use the button to complete all modules at once

## 🔒 Security Features

- Passwords hashed using bcryptjs
- JWT-based authentication
- Protected API routes
- SQL injection prevention using parameterized queries
- CORS enabled for frontend-backend communication

## 🧪 Testing the Application

### Sample User Registration

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Pre-populated Data

The database comes with 3 sample courses:

1. Web Development Fundamentals (4 modules)
2. Advanced React Patterns (3 modules)
3. Backend with Node.js (4 modules)

## 🚀 Production Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist folder using a static server
```

## 📝 Environment Variables

### Backend (.env)

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=course_dashboard
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in .env
- Check if database exists: `psql -U postgres -l`

### CORS Issues

- Backend CORS is configured to allow all origins in development
- For production, update CORS settings in `server.ts`

### Port Conflicts

- Backend default: 5000
- Frontend default: 3000
- Change in .env files if needed

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development Notes

- TypeScript strict mode enabled
- ESLint and Prettier configurations recommended
- Use `npm run dev` for hot-reload during development
- Backend uses ts-node-dev for auto-restart
- Frontend uses Vite for fast HMR

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Progress bars with visual feedback
- Color-coded completion status
- Smooth transitions and hover effects
- Clean, modern interface

## 🔄 Future Enhancements

- Add course creation/editing for instructors
- Implement video/content upload
- Add quiz/assessment functionality
- Include course categories and search
- Add user profile management
- Implement notifications
- Add course ratings and reviews
