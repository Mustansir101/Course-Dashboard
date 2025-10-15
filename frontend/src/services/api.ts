// src/services/api.ts
import axios from "axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Course,
  CourseDetail,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
};

// Course API
export const courseAPI = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>("/courses");
    return response.data;
  },

  getCourseDetails: async (courseId: number): Promise<CourseDetail> => {
    const response = await api.get<CourseDetail>(`/courses/${courseId}`);
    return response.data;
  },

  markModuleComplete: async (moduleId: number): Promise<void> => {
    await api.post(`/courses/modules/${moduleId}/complete`);
  },

  markModuleIncomplete: async (moduleId: number): Promise<void> => {
    await api.delete(`/courses/modules/${moduleId}/complete`);
  },

  markAllModulesComplete: async (courseId: number): Promise<void> => {
    await api.post(`/courses/${courseId}/complete-all`);
  },
};

export default api;
