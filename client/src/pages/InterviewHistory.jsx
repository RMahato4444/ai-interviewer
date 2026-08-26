import { useMemo, useState } from "react";

import {
    ArrowLeft,
    History,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import InterviewHistoryFilters from "../components/interview/InterviewHistoryFilters";
import InterviewHistoryCard from "../components/interview/InterviewHistoryCard";

function InterviewHistory() {
    const [search, setSearch] = useState("");

    const [type, setType] = useState("all");

    const interviews = [
        {
            id: 1,
            role: "MERN Stack Developer",
            type: "technical",
            score: 82,
            date: "Aug 25, 2026",
            duration: "18 min",
            questions: 10,
        },
        {
            id: 2,
            role: "Frontend Developer",
            type: "mixed",
            score: 76,
            date: "Aug 23, 2026",
            duration: "21 min",
            questions: 15,
        },
        {
            id: 3,
            role: "Software Engineer",
            type: "behavioral",
            score: 84,
            date: "Aug 20, 2026",
            duration: "14 min",
            questions: 10,
        },
        {
            id: 4,
            role: "Backend Developer",
            type: "technical",
            score: 71,
            date: "Aug 18, 2026",
            duration: "19 min",
            questions: 10,
        },
        {
            id: 5,
            role: "MERN Stack Developer",
            type: "mixed",
            score: 79,
            date: "Aug 15, 2026",
            duration: "23 min",
            questions: 15,
        },
    ];

    const filteredInterviews = useMemo(() => {
        return interviews.filter((interview) => {
            const matchesSearch =
                interview.role
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesType =
                type === "all" ||
                interview.type === type;

            return matchesSearch && matchesType;
        });
    }, [search, type]);

    return (
        <DashboardLayout>
            <section className="mb-8">
                <Link
                    to="/dashboard"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <History size={19} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-400">
                            Practice
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Interview History
                        </h1>
                    </div>
                </div>

                <p className="mt-3 max-w-2xl text-slate-500">
                    Review your previous interviews and track
                    your progress over time.
                </p>
            </section>

            <div className="space-y-6">
                <InterviewHistoryFilters
                    search={search}
                    setSearch={setSearch}
                    type={type}
                    setType={setType}
                />

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-900">
                            {filteredInterviews.length}
                        </span>{" "}
                        interviews
                    </p>

                    <p className="hidden text-xs text-slate-400 sm:block">
                        Latest first
                    </p>
                </div>

                {filteredInterviews.length > 0 ? (
                    <div className="space-y-3">
                        {filteredInterviews.map(
                            (interview) => (
                                <InterviewHistoryCard
                                    key={interview.id}
                                    interview={interview}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <History
                            size={28}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-bold text-slate-900">
                            No interviews found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filter.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default InterviewHistory;