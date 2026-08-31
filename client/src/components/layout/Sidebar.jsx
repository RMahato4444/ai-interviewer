import {
  LayoutDashboard,
  FileText,
  Mic2,
  History,
  User,
  Settings,
  LogOut,
  BrainCircuit,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  // ========================================
  // GET CURRENT USER
  // ========================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const userName = user?.name || "User";

  const userEmail = user?.email || "";

  const userInitials = getInitials(userName);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Resume Analyzer",
      path: "/resume",
      icon: FileText,
    },
    {
      name: "AI Interview",
      path: "/interview/setup",
      icon: Mic2,
    },
    {
      name: "Interview History",
      path: "/history",
      icon: History,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
                    fixed inset-y-0 left-0 z-50 flex w-64 flex-col
                    border-r border-slate-200 bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <BrainCircuit size={22} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">InterviewAI</h1>

              <p className="text-xs text-slate-400">AI Interview Coach</p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "sidebar-nav-active"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <nav className="space-y-1">
            <NavLink
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "sidebar-nav-active"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <User size={19} />
              Profile
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "sidebar-nav-active"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Settings size={19} />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* User section */}

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 overflow-hidden items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {user?.profileImage ? (
                <img
                  src={
                    user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `http://localhost:5000${user.profileImage}`
                  }
                  alt={`${userName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="truncate text-xs text-slate-500">{userEmail}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ========================================
// GET INITIALS
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

export default Sidebar;
