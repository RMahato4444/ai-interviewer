import { useState } from "react";

import { Menu, Bell, Search, Moon, Sun } from "lucide-react";

import { getStoredTheme, setTheme } from "../../utils/theme";
function Topbar({ setMobileOpen }) {
  const [theme, setThemeState] = useState(getStoredTheme());
  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    setThemeState(nextTheme);
  };
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const userName = user?.name || "User";

  const userInitials = getInitials(userName);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-search hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleThemeToggle}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="topbar-theme-toggle flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {user?.profileImage ? (
              <img
                src={
                  user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `${import.meta.env.VITE_API_URL}${user.profileImage}`
                }
                alt={`${userName} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>

            <p className="text-xs text-slate-500">Candidate</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ========================================
// INITIALS
// ========================================

function getInitials(name) {
  if (!name) {
    return "U";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default Topbar;
