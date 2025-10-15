// src/types/index.ts

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  total_modules: number;
  completed_modules: number;
  progress_percentage: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface CourseDetail extends Course {
  modules: Module[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export type FilterType = "all" | "completed" | "in-progress" | "not-started";
