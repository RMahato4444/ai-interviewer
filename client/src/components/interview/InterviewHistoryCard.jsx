import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Target,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function InterviewHistoryCard({
    interview,
}) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Score */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900">
                    <div className="text-center text-white">
                        <p className="text-xl font-bold">
                            {interview.score}
                        </p>

                        <p className="text-[9px] text-slate-400">
                            SCORE
                        </p>
                    </div>
                </div>

                {/* Main */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                            {interview.role}
                        </h3>

                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                            {interview.type}
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            {interview.date}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Clock3 size={13} />
                            {interview.duration}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Target size={13} />
                            {interview.questions} questions
                        </span>
                    </div>
                </div>

                {/* Action */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/interview/result")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    View Result
                    <ArrowUpRight size={15} />
                </button>
            </div>
        </div>
    );
}

export default InterviewHistoryCard;