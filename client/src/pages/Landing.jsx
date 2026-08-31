import { Moon, Sun } from "lucide-react";

import { Link } from "react-router-dom";

import { getStoredTheme, setTheme } from "../utils/theme";

import { useState } from "react";

function Landing() {
  const [theme, setThemeState] = useState(getStoredTheme());

  // ========================================
  // TOGGLE THEME
  // ========================================

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    setThemeState(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <div className="landing-page">
      {/* ========================================
                NAVIGATION
            ======================================== */}

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-2xl font-bold">
          InterviewAI
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}

          <button
            type="button"
            onClick={handleThemeToggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="landing-nav-button flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Login */}

          <Link
            to="/login"
            className="cursor-pointer rounded-lg px-4 py-2 font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Login
          </Link>

          {/* Get Started */}

          <Link
            to="/register"
            className="auth-green-button rounded-xl px-5 py-2.5 font-semibold"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ========================================
                HERO
            ======================================== */}

      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm text-white">
            AI-powered interview preparation
          </div>

          <h2 className="text-5xl font-bold leading-tight md:text-7xl">
            Practice interviews.
            <br />
            <span className="text-slate-500 dark:text-slate-400">
              Get better jobs.
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Upload your resume, practice realistic AI interviews, and receive
            detailed feedback to improve your performance.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {/* Start Practicing */}

            <Link
              to="/register"
              className="auth-green-button rounded-xl px-6 py-3 font-semibold"
            >
              Start Practicing
            </Link>

            {/* Sign In */}

            <Link
              to="/login"
              className="auth-blue-button rounded-xl px-6 py-3 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
