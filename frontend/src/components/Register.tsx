// src/components/Register.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-12 border border-gray-100">
          <div className="mb-10">
            <h2 className="text-center text-4xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-3 text-center text-base text-gray-600">
              Start your learning journey today.
            </p>
          </div>
          <form className="space-y-7" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-5 border-2 border-red-200">
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-5 py-4 border-2 border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-5 py-4 border-2 border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="appearance-none block w-full px-5 py-4 border-2 border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all hover:shadow-xl active:scale-95 transform"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-base font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Already have an account?{" "}
                <span className="underline">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
