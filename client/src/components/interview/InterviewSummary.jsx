import { BriefcaseBusiness, Gauge, ListChecks, Mic2, Play } from "lucide-react";

function InterviewSummary({
  role,
  // experience,
  // type,
  difficulty,
  questions,
  mode,
  onStart,
  loading,
}) {
  return (
    <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Play size={21} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        Ready to practice?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Review your interview settings before you begin.
      </p>

      <div className="mt-6 space-y-4">
        <SummaryItem
          icon={BriefcaseBusiness}
          label="Role"
          value={role || "Not selected"}
        />

        <SummaryItem
          icon={Gauge}
          label="Difficulty"
          value={capitalize(difficulty)}
        />

        <SummaryItem
          icon={ListChecks}
          label="Questions"
          value={`${questions} questions`}
        />

        <SummaryItem icon={Mic2} label="Mode" value={capitalize(mode)} />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onStart}
          disabled={loading || !role.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Creating Interview..." : "Start Interview"}
        </button>

        {!role && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Select a target role to continue.
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={17} className="text-slate-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function capitalize(value) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default InterviewSummary;
