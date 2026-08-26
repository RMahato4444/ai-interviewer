import {
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function RecentInterviews() {
    const interviews = [
        {
            role: "Frontend Developer",
            type: "Technical",
            date: "Today",
            score: 84,
        },
        {
            role: "MERN Stack Developer",
            type: "Mixed",
            date: "Yesterday",
            score: 78,
        },
        {
            role: "Software Engineer",
            type: "Behavioral",
            date: "Aug 21",
            score: 72,
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                    <h2 className="font-bold text-slate-900">
                        Recent Interviews
                    </h2>

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

            <div className="divide-y divide-slate-100">
                {interviews.map((interview) => (
                    <div
                        key={`${interview.role}-${interview.date}`}
                        className="flex items-center justify-between p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <CheckCircle2
                                    size={19}
                                    className="text-slate-700"
                                />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    {interview.role}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {interview.type} ·{" "}
                                    {interview.date}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">
                                    {interview.score}%
                                </p>

                                <p className="text-xs text-slate-500">
                                    Score
                                </p>
                            </div>

                            <button className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 sm:block">
                                <ArrowUpRight size={17} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentInterviews;