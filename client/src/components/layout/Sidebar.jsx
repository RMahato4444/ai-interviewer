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

import { NavLink } from "react-router-dom";

function Sidebar({ mobileOpen, setMobileOpen }) {
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
                    ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
                    <NavLink
                        to="/dashboard"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <BrainCircuit size={22} />
                        </div>

                        <div>
                            <h1 className="font-bold text-slate-900">
                                InterviewAI
                            </h1>

                            <p className="text-xs text-slate-400">
                                AI Interview Coach
                            </p>
                        </div>
                    </NavLink>

                    <button
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
                                    onClick={() =>
                                        setMobileOpen(false)
                                    }
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-slate-900 text-white"
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
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <User size={19} />
                            Profile
                        </NavLink>

                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                            <Settings size={19} />
                            Settings
                        </button>
                    </nav>
                </div>

                {/* User section */}
                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                            RM
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                Rahul Mahato
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                rahul@example.com
                            </p>
                        </div>

                        <button className="text-slate-400 hover:text-slate-700">
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;