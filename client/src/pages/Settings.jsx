import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Mic2,
  Bell,
  BrainCircuit,
  RotateCcw,
  LogOut,
  Save,
  SlidersHorizontal,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import { getStoredTheme, setTheme, getSystemTheme } from "../utils/theme";

const SETTINGS_KEY = "appSettings";

const DEFAULT_SETTINGS = {
  defaultInterviewType: "mixed",

  defaultDifficulty: "medium",

  defaultQuestions: 10,

  autoReadQuestions: true,

  speechRecognition: true,

  interviewReminders: false,

  performanceUpdates: true,
};

// ========================================
// LOAD SETTINGS
// ========================================

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);

    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(stored),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

// ========================================
// SETTINGS PAGE
// ========================================

function Settings() {
  const navigate = useNavigate();

  const [theme, setThemeState] = useState(getStoredTheme());

  const [settings, setSettings] = useState(loadSettings);

  const [saved, setSaved] = useState(false);

  // ========================================
  // SYSTEM THEME LISTENER
  // ========================================

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  // ========================================
  // CHANGE THEME
  // ========================================

  const handleThemeChange = (nextTheme) => {
    setThemeState(nextTheme);

    setTheme(nextTheme);
  };

  // ========================================
  // UPDATE SETTING
  // ========================================

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  // ========================================
  // SAVE SETTINGS
  // ========================================

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    // Tell other parts of
    // the application that
    // settings changed.

    window.dispatchEvent(new CustomEvent("app-settings-change"));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ========================================
  // RESET SETTINGS
  // ========================================

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));

    handleThemeChange("system");

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <DashboardLayout>
      {/* Header */}

      <section className="mb-8">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-400">Preferences</p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Settings
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-slate-500">
          Customize your InterviewAI experience, interview preferences and
          notifications.
        </p>
      </section>

      <div className="space-y-6">
        {/* ==================================
                    APPEARANCE
                ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Sun size={20} className="text-slate-700" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Appearance</h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose how InterviewAI looks across the entire application.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ThemeOption
              icon={Sun}
              title="Light"
              description="Always use light mode"
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
            />

            <ThemeOption
              icon={Moon}
              title="Dark"
              description="Easy on your eyes"
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
            />

            <ThemeOption
              icon={Monitor}
              title="System"
              description={`Follow system (${getSystemTheme()})`}
              active={theme === "system"}
              onClick={() => handleThemeChange("system")}
            />
          </div>
        </section>

        {/* ==================================
                    INTERVIEW PREFERENCES
                ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <SettingHeader
            icon={BrainCircuit}
            title="Interview Preferences"
            description="Choose the defaults used when preparing an interview."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Type */}

            <SettingSelect
              label="Default Interview Type"
              value={settings.defaultInterviewType}
              onChange={(value) => updateSetting("defaultInterviewType", value)}
              options={[
                {
                  value: "mixed",
                  label: "Mixed",
                },
                {
                  value: "technical",
                  label: "Technical",
                },
                {
                  value: "behavioral",
                  label: "Behavioral",
                },
              ]}
            />

            {/* Difficulty */}

            <SettingSelect
              label="Default Difficulty"
              value={settings.defaultDifficulty}
              onChange={(value) => updateSetting("defaultDifficulty", value)}
              options={[
                {
                  value: "easy",
                  label: "Easy",
                },
                {
                  value: "medium",
                  label: "Medium",
                },
                {
                  value: "hard",
                  label: "Hard",
                },
              ]}
            />

            {/* Questions */}

            <SettingSelect
              label="Default Questions"
              value={settings.defaultQuestions}
              onChange={(value) =>
                updateSetting("defaultQuestions", Number(value))
              }
              options={[
                {
                  value: 5,
                  label: "5 Questions",
                },
                {
                  value: 10,
                  label: "10 Questions",
                },
                {
                  value: 15,
                  label: "15 Questions",
                },
              ]}
            />
          </div>
        </section>

        {/* ==================================
                    VOICE
                ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <SettingHeader
            icon={Mic2}
            title="Voice & Interview"
            description="Control how voice features behave during interviews."
          />

          <div className="mt-6 space-y-4">
            <ToggleSetting
              title="Auto-read questions"
              description="Automatically read each interview question aloud."
              checked={settings.autoReadQuestions}
              onChange={(value) => updateSetting("autoReadQuestions", value)}
            />

            <ToggleSetting
              title="Speech recognition"
              description="Allow the microphone to convert your spoken answers into text."
              checked={settings.speechRecognition}
              onChange={(value) => updateSetting("speechRecognition", value)}
            />
          </div>
        </section>

        {/* ==================================
                    NOTIFICATIONS
                ================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <SettingHeader
            icon={Bell}
            title="Notifications"
            description="Choose which updates you want to receive."
          />

          <div className="mt-6 space-y-4">
            <ToggleSetting
              title="Interview reminders"
              description="Get reminders to continue your interview practice."
              checked={settings.interviewReminders}
              onChange={(value) => updateSetting("interviewReminders", value)}
            />

            <ToggleSetting
              title="Performance updates"
              description="Receive updates about your interview performance and progress."
              checked={settings.performanceUpdates}
              onChange={(value) => updateSetting("performanceUpdates", value)}
            />
          </div>
        </section>

        {/* ==================================
                    ACCOUNT
                ================================== */}

        <section className="rounded-2xl border border-red-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Account</h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign out from this InterviewAI session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-400/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </section>

        {/* ==================================
                    SAVE BAR
                ================================== */}

        <div className="settings-save-bar sticky bottom-4 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900">Settings</p>

            <p className="text-xs text-slate-500">
              Your preferences are saved only on this device.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>

          {saved && (
            <span className="absolute -top-10 right-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 shadow-sm">
              Settings saved
            </span>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ========================================
// SETTING HEADER
// ========================================

function SettingHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon size={20} className="text-slate-700" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

// ========================================
// THEME OPTION
// ========================================

function ThemeOption({ icon: Icon, title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active
          ? "settings-theme-active border-slate-900 bg-slate-50 ring-2 ring-slate-900/10"
          : "border-slate-200 bg-white hover:border-slate-400"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon size={18} className="text-slate-700" />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

// ========================================
// SELECT
// ========================================

function SettingSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ========================================
// TOGGLE
// ========================================

function ToggleSetting({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl bg-slate-50 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "settings-toggle-on" : "settings-toggle-off"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;
