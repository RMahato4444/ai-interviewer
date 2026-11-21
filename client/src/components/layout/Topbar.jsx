import { useEffect, useMemo, useRef, useState } from "react";

import {
    Menu,
    Bell,
    Search,
    Moon,
    Sun,
    FileText,
    Trophy,
    CalendarDays,
    LayoutDashboard,
    Mic2,
    History,
    User,
    Settings as SettingsIcon,
    X,
    ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getStoredTheme, setTheme } from "../../utils/theme";

import {
    buildNotifications,
    getNotificationPreferences,
    getReadNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../utils/notifications";

import { getInterviews, getResumes } from "../../services/api";

function Topbar({ setMobileOpen }) {
    const navigate = useNavigate();

    const [theme, setThemeState] = useState(getStoredTheme());
    const [user, setUser] = useState(() => readStoredUser());

    const [query, setQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchData, setSearchData] = useState({
        interviews: [],
        resumes: [],
    });
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState("");

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notificationPreferences, setNotificationPreferences] = useState(
        getNotificationPreferences
    );
    const [readIds, setReadIds] = useState(getReadNotificationIds);

    const searchRef = useRef(null);
    const notificationRef = useRef(null);

    // Load the current user's interview and resume data.
    useEffect(() => {
        let active = true;

        const loadActivity = async () => {
            try {
                setDataLoading(true);
                setDataError("");

                const [interviewResult, resumeResult] = await Promise.allSettled([
                    getInterviews(),
                    getResumes(),
                ]);

                if (!active) return;

                const unavailable = [];

                if (interviewResult.status === "rejected") {
                    unavailable.push("interview history");
                }

                if (resumeResult.status === "rejected") {
                    unavailable.push("resumes");
                }

                setSearchData({
                    interviews:
                        interviewResult.status === "fulfilled"
                            ? interviewResult.value.interviews || []
                            : [],
                    resumes:
                        resumeResult.status === "fulfilled"
                            ? resumeResult.value.resumes || []
                            : [],
                });

                setDataError(
                    unavailable.length
                        ? "Some results are unavailable: " + unavailable.join(" and ") + "."
                        : ""
                );
            } catch (error) {
                if (!active) return;

                console.error("TOPBAR SEARCH DATA ERROR:", error);
                setDataError(error.message || "Unable to load search data.");
            } finally {
                if (active) setDataLoading(false);
            }
        };

        const handleDataChange = () => loadActivity();

        const handleStorageChange = (event) => {
            if (event.key === "user") setUser(readStoredUser());

            if (event.key === "appSettings") {
                setNotificationPreferences(getNotificationPreferences());
            }

            if (event.key === "interviewAINotificationRead") {
                setReadIds(getReadNotificationIds());
            }
        };

        loadActivity();

        window.addEventListener("app-data-change", handleDataChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            active = false;
            window.removeEventListener("app-data-change", handleDataChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Apply notification preferences after the Settings page saves them.
    useEffect(() => {
        const refreshPreferences = () => {
            setNotificationPreferences(getNotificationPreferences());
        };

        window.addEventListener("app-settings-change", refreshPreferences);

        return () => {
            window.removeEventListener("app-settings-change", refreshPreferences);
        };
    }, []);

    // Close both popovers when the user clicks elsewhere or presses Escape.
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSearchOpen(false);
                setNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleThemeToggle = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        setThemeState(nextTheme);
    };

    // Build matching app pages, interviews, and resumes.
    const searchResults = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (term.length < 2) return [];

        const pages = [
            {
                id: "page-dashboard",
                title: "Dashboard",
                description: "Your overview and performance",
                to: "/dashboard",
                icon: "page",
            },
            {
                id: "page-resume",
                title: "Resume Analyzer",
                description: "Upload and analyze your resume",
                to: "/resume",
                icon: "resume",
            },
            {
                id: "page-interview",
                title: "AI Interview",
                description: "Configure and start a practice interview",
                to: "/interview/setup",
                icon: "interview",
            },
            {
                id: "page-history",
                title: "Interview History",
                description: "Review your previous interviews",
                to: "/history",
                icon: "history",
            },
            {
                id: "page-profile",
                title: "Profile",
                description: "Your personal information",
                to: "/profile",
                icon: "profile",
            },
            {
                id: "page-settings",
                title: "Settings",
                description: "Appearance and notification preferences",
                to: "/settings",
                icon: "settings",
            },
        ].filter((item) =>
            (item.title + " " + item.description).toLowerCase().includes(term)
        );

        const interviews = searchData.interviews
            .filter((interview) => {
                const searchable = [
                    interview.targetRole,
                    interview.interviewType,
                    interview.difficulty,
                    interview.status,
                    interview.overallScore,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(term);
            })
            .map((interview) => {
                const completed = interview.status === "completed";
                const cancelled = interview.status === "cancelled";
                const id = interview._id;

                return {
                    id: "interview-" + id,
                    title: interview.targetRole || "Untitled interview",
                    description:
                        (interview.interviewType || "Interview") +
                        " · " +
                        formatLabel(interview.status || "created") +
                        (typeof interview.overallScore === "number"
                            ? " · " + interview.overallScore + "%"
                            : ""),
                    to: completed
                        ? "/interview/result/" + id
                        : cancelled
                            ? "/history"
                            : "/interview/live/" + id,
                    icon: "interview",
                };
            });

        const resumes = searchData.resumes
            .filter((resume) =>
                (resume.originalName || "").toLowerCase().includes(term)
            )
            .map((resume) => ({
                id: "resume-" + resume._id,
                title: resume.originalName || "Uploaded resume",
                description:
                    typeof resume.aiAnalysis?.overallScore === "number"
                        ? "Analyzed · " + resume.aiAnalysis.overallScore + "% score"
                        : "Uploaded · Analysis pending",
                to: "/resume",
                state: {
                    resumeId: resume._id,
                    resume,
                },
                icon: "resume",
            }));

        return [...pages, ...interviews, ...resumes].slice(0, 8);
    }, [query, searchData]);

    const openSearchResult = (result) => {
        setQuery("");
        setSearchOpen(false);
        navigate(result.to, result.state ? { state: result.state } : undefined);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter" && searchResults.length > 0) {
            event.preventDefault();
            openSearchResult(searchResults[0]);
        }
    };

    // Build notifications from actual interview and resume activity.
    const notifications = useMemo(
        () =>
            buildNotifications(
                searchData.interviews,
                searchData.resumes,
                notificationPreferences
            ),
        [searchData, notificationPreferences]
    );

    const unreadCount = notifications.filter(
        (notification) => !readIds.includes(notification.id)
    ).length;

    const handleNotificationClick = (notification) => {
        const nextReadIds = markNotificationRead(notification.id);
        setReadIds(nextReadIds);
        setNotificationsOpen(false);

        if (notification.to) {
            navigate(
                notification.to,
                notification.state
                    ? { state: notification.state }
                    : undefined
            );
        }
    };

    const handleMarkAllRead = () => {
        const nextReadIds = markAllNotificationsRead(
            notifications.map((notification) => notification.id)
        );

        setReadIds(nextReadIds);
    };

    const userName = user?.name || "User";
    const userInitials = getInitials(userName);

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            {/* LEFT */}

            <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation"
                    className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={22} />
                </button>

                {/* GLOBAL SEARCH */}

                <div ref={searchRef} className="relative hidden md:block">
                    <div className="topbar-search flex w-60 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-slate-400">
                        <Search size={17} className="shrink-0 text-slate-400" />

                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setSearchOpen(true);
                            }}
                            onFocus={() => setSearchOpen(true)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search..."
                            aria-label="Search interviews, resumes and pages"
                            aria-expanded={searchOpen && query.trim().length >= 2}
                            aria-controls="global-search-results"
                            className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />

                        {query && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => {
                                    setQuery("");
                                    setSearchOpen(true);
                                }}
                                className="rounded p-0.5 text-slate-400 hover:text-slate-700"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {searchOpen && query.trim().length >= 2 && (
                        <div
                            id="global-search-results"
                            className="absolute left-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                        >
                            <div className="border-b border-slate-100 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Search results
                                </p>
                            </div>

                            {dataLoading ? (
                                <p className="px-4 py-6 text-sm text-slate-500">
                                    Searching your workspace...
                                </p>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-80 overflow-y-auto p-2">
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.id}
                                            type="button"
                                            onClick={() => openSearchResult(result)}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                {result.icon === "resume" ? (
                                                    <FileText size={17} />
                                                ) : result.icon === "interview" ? (
                                                    <Mic2 size={17} />
                                                ) : result.icon === "history" ? (
                                                    <History size={17} />
                                                ) : result.icon === "profile" ? (
                                                    <User size={17} />
                                                ) : result.icon === "settings" ? (
                                                    <SettingsIcon size={17} />
                                                ) : (
                                                    <LayoutDashboard size={17} />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {result.title}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {result.description}
                                                </p>
                                            </div>

                                            <ArrowUpRight size={15} className="shrink-0 text-slate-400" />
                                        </button>
                                    ))}
                                </div>
                            ) : dataError ? (
                                <p className="px-4 py-6 text-sm text-red-600">
                                    {dataError}
                                </p>
                            ) : (
                                <p className="px-4 py-6 text-sm text-slate-500">
                                    No matching pages, interviews or resumes found.
                                </p>
                            )}

                            <div className="border-t border-slate-100 px-4 py-2">
                                <p className="text-[11px] text-slate-400">
                                    Press Enter to open the first result
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-3">
                {/* THEME */}

                <button
                    type="button"
                    onClick={handleThemeToggle}
                    title={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    aria-label={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    className="topbar-theme-toggle flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* NOTIFICATIONS */}

                <div ref={notificationRef} className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setNotificationsOpen((open) => !open);
                            setSearchOpen(false);
                        }}
                        aria-label={
                            unreadCount > 0
                                ? "Notifications, " + unreadCount + " unread"
                                : "Notifications"
                        }
                        aria-expanded={notificationsOpen}
                        className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <Bell size={20} />

                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[9px] font-bold text-white">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Notifications
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Updates from your workspace
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    disabled={unreadCount === 0}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Mark all read
                                </button>
                            </div>

                            {notifications.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto p-2">
                                    {notifications.map((notification) => {
                                        const isRead = readIds.includes(notification.id);

                                        const NotificationIcon =
                                            notification.icon === "resume"
                                                ? FileText
                                                : notification.icon === "reminder"
                                                    ? CalendarDays
                                                    : Trophy;

                                        return (
                                            <button
                                                key={notification.id}
                                                type="button"
                                                onClick={() => handleNotificationClick(notification)}
                                                className={
                                                    isRead
                                                        ? "flex w-full items-start gap-3 rounded-xl p-3 text-left opacity-65 transition hover:bg-slate-50"
                                                        : "flex w-full items-start gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-slate-100"
                                                }
                                            >
                                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                    <NotificationIcon size={17} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {notification.title}
                                                        </p>

                                                        {!isRead && (
                                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-2 text-[11px] text-slate-400">
                                                        {formatRelativeDate(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-5 py-8 text-center">
                                    <Bell size={24} className="mx-auto text-slate-300" />

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        No notifications
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Turn on performance updates or interview reminders in Settings to see activity here.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNotificationsOpen(false);
                                            navigate("/settings");
                                        }}
                                        className="mt-3 text-xs font-semibold text-slate-700 underline underline-offset-2"
                                    >
                                        Open Settings
                                    </button>
                                </div>
                            )}

                            <div className="border-t border-slate-100 px-4 py-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNotificationsOpen(false);
                                        navigate("/settings");
                                    }}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                                >
                                    Notification settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                {/* USER */}

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xs font-bold text-white">
                        {user?.profileImage ? (
                            <img
                                src={
                                    user.profileImage.startsWith("http")
                                        ? user.profileImage
                                        : import.meta.env.VITE_API_URL + user.profileImage
                                }
                                alt={userName + " profile"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            userInitials
                        )}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">
                            {userName}
                        </p>

                        <p className="text-xs text-slate-500">
                            Candidate
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

function readStoredUser() {
    try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
}

function getInitials(name) {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatLabel(value) {
    return String(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatRelativeDate(value) {
    if (!value) return "Recently";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Recently";

    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}

export default Topbar;
