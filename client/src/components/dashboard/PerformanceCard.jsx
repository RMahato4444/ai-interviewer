import { TrendingUp } from "lucide-react";

function PerformanceCard({ interviews = [] }) {
  const technical = getAverageByType(interviews, "technical");

  const behavioral = getAverageByType(interviews, "behavioral");

  const mixed = getAverageByType(interviews, "mixed");

  const average = getOverallAverage(interviews);

  const displayAverage = average !== null ? average : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Interview Performance</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your average performance
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <TrendingUp size={19} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-8">
        {/* Circle */}

        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100"
            />

            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * displayAverage) / 100}
              className="text-slate-900"
            />
          </svg>

          <div className="absolute text-center">
            <p className="text-2xl font-bold text-slate-900">
              {average !== null ? `${average}%` : "—"}
            </p>

            <p className="text-xs text-slate-500">Average</p>
          </div>
        </div>

        {/* Type performance */}

        <div className="flex-1 space-y-5">
          <ScoreItem label="Technical Interviews" score={technical} />

          <ScoreItem label="Behavioral Interviews" score={behavioral} />

          <ScoreItem label="Mixed Interviews" score={mixed} />
        </div>
      </div>
    </div>
  );
}

// ========================================
// AVERAGE BY TYPE
// ========================================

function getAverageByType(interviews, type) {
  const matching = interviews.filter(
    (interview) => interview.interviewType?.toLowerCase() === type,
  );

  const scores = matching
    .map((interview) => interview.overallScore)
    .filter((score) => typeof score === "number");

  if (scores.length === 0) {
    return null;
  }

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length,
  );
}

// ========================================
// OVERALL AVERAGE
// ========================================

function getOverallAverage(interviews) {
  const scores = interviews
    .map((interview) => interview.overallScore)
    .filter((score) => typeof score === "number");

  if (scores.length === 0) {
    return null;
  }

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length,
  );
}

// ========================================
// SCORE ITEM
// ========================================

function ScoreItem({ label, score }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>

        <span className="font-bold text-slate-900">
          {score !== null ? `${score}%` : "—"}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{
            width: score !== null ? `${score}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

export default PerformanceCard;
