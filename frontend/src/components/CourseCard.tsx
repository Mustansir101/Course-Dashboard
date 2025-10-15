// src/components/CourseCard.tsx
import React from "react";
import { Course } from "../types";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  onUpdate: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const progressPercentage = parseFloat(course.progress_percentage.toString());

  const getProgressColor = () => {
    if (progressPercentage === 0) return "bg-gray-300";
    if (progressPercentage >= 100) return "bg-green-500";
    return "bg-indigo-600";
  };

  const getStatusBadge = () => {
    if (progressPercentage === 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
          Not Started
        </span>
      );
    }
    if (progressPercentage >= 100) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
        In Progress
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {course.title}
          </h3>
          {getStatusBadge()}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span className="font-medium">
              {course.completed_modules}/{course.total_modules} modules
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${course.progress_percentage}%` }}
            ></div>
          </div>

          <div className="text-right text-sm font-medium text-gray-700">
            {course.progress_percentage}%
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <button
          onClick={() => navigate(`/course/${course.id}`)}
          className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
