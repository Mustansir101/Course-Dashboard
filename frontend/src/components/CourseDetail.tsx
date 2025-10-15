// src/components/CourseDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "../services/api";
import { CourseDetail as CourseDetailType, Module } from "../types";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCourseDetails = async () => {
    if (!courseId) return;

    try {
      const data = await courseAPI.getCourseDetails(parseInt(courseId));
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handleToggleModule = async (module: Module) => {
    setActionLoading(true);
    try {
      if (module.is_completed) {
        await courseAPI.markModuleIncomplete(module.id);
      } else {
        await courseAPI.markModuleComplete(module.id);
      }
      await fetchCourseDetails();
    } catch (error) {
      console.error("Failed to toggle module:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllComplete = async () => {
    if (!courseId || !window.confirm("Mark all modules as completed?")) return;

    setActionLoading(true);
    try {
      await courseAPI.markAllModulesComplete(parseInt(courseId));
      await fetchCourseDetails();
    } catch (error) {
      console.error("Failed to mark all as complete:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Course not found</div>
      </div>
    );
  }

  const completedCount = course.modules.filter((m) => m.is_completed).length;
  const totalCount = course.modules.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-8 px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg flex items-center text-sm font-bold transition-all"
          >
            <span className="mr-2">←</span> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {course.description}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Course Progress
              </h2>
              <p className="text-base text-gray-600 mt-2">
                {completedCount} of {totalCount} modules completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-indigo-600">
                {progressPercentage}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden shadow-inner">
            <div
              className={`h-5 rounded-full transition-all duration-500 ${
                progressPercentage === 100 ? "bg-green-500" : "bg-indigo-600"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Mark All Button */}
          {completedCount < totalCount && (
            <button
              onClick={handleMarkAllComplete}
              disabled={actionLoading}
              className="w-full mt-2 px-8 py-4 bg-green-600 text-white text-base font-bold rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-all hover:shadow-xl active:scale-95"
            >
              {actionLoading ? "Processing..." : "Mark All as Completed"}
            </button>
          )}
        </div>

        {/* Modules List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className={`p-10 hover:bg-gray-50 transition-all duration-200 ${
                  module.is_completed ? "bg-green-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => handleToggleModule(module)}
                      disabled={actionLoading}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        module.is_completed
                          ? "bg-green-500 border-green-500 shadow-md"
                          : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                      } ${
                        actionLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:scale-110"
                      }`}
                    >
                      {module.is_completed && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <h3
                        className={`text-xl font-bold ${
                          module.is_completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        Module {index + 1}: {module.title}
                      </h3>
                      {module.is_completed && (
                        <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-full bg-green-100 text-green-800 w-fit">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {module.description}
                    </p>
                    {module.is_completed && module.completed_at && (
                      <p className="mt-4 text-sm text-gray-500 font-semibold">
                        Completed on{" "}
                        {new Date(module.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
