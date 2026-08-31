import { useState } from "react";

import { ArrowLeft, Moon, Sun } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { getStoredTheme, setTheme } from "../utils/theme";

function Login() {
  const navigate = useNavigate();
  const [theme, setThemeState] = useState(getStoredTheme());

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ========================================
  // THEME TOGGLE
  // ========================================

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    setThemeState(nextTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation

    if (!email || !password) {
      setError("Email and password are required.");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Store JWT

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        throw new Error(
          "Login successful, but no authentication token was returned.",
        );
      }

      localStorage.setItem("token", token);

      // Store user

      const user = data.user || data.data?.user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Dashboard

      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(error.message || "Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page relative flex min-h-screen items-center justify-center px-6">
      {/* Theme Toggle */}

      <button
        type="button"
        onClick={handleThemeToggle}
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        className="auth-theme-toggle absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        {/* Back */}

        <Link
          to="/"
          className="auth-back-button inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">Welcome back</h1>

        <p className="mt-2 text-slate-400">
          Sign in to continue your interview preparation.
        </p>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>

          {/* SIGN IN */}

          <button
            type="submit"
            disabled={loading}
            className="auth-blue-button w-full rounded-xl py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
