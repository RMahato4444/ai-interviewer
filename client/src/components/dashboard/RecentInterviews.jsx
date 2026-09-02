import { CheckCircle2, ArrowUpRight } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function RecentInterviews({ interviews = [] }) {
  const navigate = useNavigate();

  const recentInterviews = [...interviews]
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.createdAt) -
        new Date(a.completedAt || a.createdAt),
    )
    .slice(0, 3);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h2 className="font-bold text-slate-900">Recent Interviews</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest practice sessions
          </p>
        </div>

        <Link
          to="/history"
          className="text-sm font-semibold text-slate-900 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Content */}

      {recentInterviews.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {recentInterviews.map((interview) => (
            <div
              key={interview._id}
              className="flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <CheckCircle2 size={19} className="text-slate-700" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {interview.targetRole}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatType(interview.interviewType)}

                    {" · "}

                    {formatDate(interview.completedAt || interview.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {typeof interview.overallScore === "number"
                      ? `${interview.overallScore}%`
                      : "—"}
                  </p>

                  <p className="text-xs text-slate-500">Score</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/interview/result/${interview._id}`)}
                  className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 sm:block"
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-600">
            No completed interviews yet.
          </p>

          <Link
            to="/interview/setup"
            className="mt-3 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            Start your first interview →
          </Link>
        </div>
      )}
    </div>
  );
}

// ========================================
// DATE
// ========================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "Unknown date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

// ========================================
// TYPE
// ========================================

function formatType(type) {
  if (!type) {
    return "Interview";
  }

  return type;
}

export default RecentInterviews;
