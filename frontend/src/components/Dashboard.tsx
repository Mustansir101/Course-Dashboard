// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseAPI } from "../services/api";
import { Course, FilterType } from "../types";
import CourseCard from "./CourseCard";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    switch (filter) {
      case "completed":
        filtered = courses.filter((c) => {
          const progress = parseFloat(c.progress_percentage.toString());
          return progress >= 100;
        });
        break;
      case "in-progress":
        filtered = courses.filter((c) => {
          const progress = parseFloat(c.progress_percentage.toString());
          return progress > 0 && progress < 100;
        });
        break;
      case "not-started":
        filtered = courses.filter((c) => {
          const progress = parseFloat(c.progress_percentage.toString());
          return progress === 0;
        });
        break;
      default:
        filtered = courses;
    }

    setFilteredCourses(filtered);
  }, [filter, courses]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Dashboard
            </h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "in-progress"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            In Progress (
            {
              courses.filter(
                (c) => c.progress_percentage > 0 && c.progress_percentage < 100
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "completed"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Completed (
            {courses.filter((c) => c.progress_percentage === 100).length})
          </button>
          <button
            onClick={() => setFilter("not-started")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "not-started"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Not Started (
            {courses.filter((c) => c.progress_percentage === 0).length})
          </button>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No courses found for this filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onUpdate={fetchCourses}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
