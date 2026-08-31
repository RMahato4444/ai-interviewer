import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ArrowLeft,
    History,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import InterviewHistoryFilters from "../components/interview/InterviewHistoryFilters";
import InterviewHistoryCard from "../components/interview/InterviewHistoryCard";

import {
    getInterviews,
} from "../services/api";


function InterviewHistory() {

    const [search, setSearch] =
        useState("");

    const [type, setType] =
        useState("all");

    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD INTERVIEW HISTORY
    // ========================================

    useEffect(() => {

        const loadInterviews =
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    const data =
                        await getInterviews();

                    setInterviews(
                        data.interviews || []
                    );

                } catch (error) {

                    console.error(
                        "GET INTERVIEW HISTORY ERROR:",
                        error
                    );

                    setError(
                        error.message ||
                        "Failed to load interview history."
                    );

                } finally {

                    setLoading(false);

                }
            };


        loadInterviews();

    }, []);


    // ========================================
    // MAP BACKEND DATA
    // ========================================

    const mappedInterviews =
        useMemo(() => {

            return interviews.map(
                (interview) => ({
                    id:
                        interview._id,

                    role:
                        interview.targetRole,

                    type:
                        normalizeType(
                            interview.interviewType
                        ),

                    score:
                        typeof interview.overallScore ===
                        "number"
                            ? interview.overallScore
                            : null,

                    date:
                        formatDate(
                            interview.completedAt ||
                            interview.createdAt
                        ),

                    duration:
                        calculateDuration(
                            interview.startedAt,
                            interview.completedAt
                        ),

                    questions:
                        interview.totalQuestions,

                    status:
                        interview.status,
                })
            );

        }, [interviews]);


    // ========================================
    // FILTER
    // ========================================

    const filteredInterviews =
        useMemo(() => {

            return mappedInterviews.filter(
                (interview) => {

                    const matchesSearch =
                        interview.role
                            .toLowerCase()
                            .includes(
                                search
                                    .toLowerCase()
                            );

                    const matchesType =
                        type === "all" ||
                        interview.type === type;

                    return (
                        matchesSearch &&
                        matchesType
                    );
                }
            );

        }, [
            mappedInterviews,
            search,
            type,
        ]);


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


                {/* Loading */}

                {loading && (

                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading interview history...
                        </p>

                    </div>

                )}


                {/* Error */}

                {!loading &&
                    error && (

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                        <p className="text-sm font-medium text-red-700">
                            {error}
                        </p>

                    </div>

                )}


                {/* Empty / Results */}

                {!loading &&
                    !error && (
                    filteredInterviews.length > 0 ? (

                        <div className="space-y-3">

                            {filteredInterviews.map(
                                (interview) => (

                                    <InterviewHistoryCard
                                        key={
                                            interview.id
                                        }
                                        interview={
                                            interview
                                        }
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

                    )
                )}

            </div>

        </DashboardLayout>
    );
}


// ========================================
// NORMALIZE TYPE
// ========================================

function normalizeType(type) {

    if (!type) {
        return "mixed";
    }

    return type
        .toString()
        .toLowerCase()
        .replace(
            "behavioral",
            "behavioral"
        );
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Unknown date";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown date";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}


// ========================================
// CALCULATE DURATION
// ========================================

function calculateDuration(
    startedAt,
    completedAt
) {

    if (
        !startedAt ||
        !completedAt
    ) {
        return "—";
    }

    const start =
        new Date(startedAt);

    const end =
        new Date(completedAt);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return "—";
    }

    const milliseconds =
        end.getTime() -
        start.getTime();

    const minutes =
        Math.max(
            0,
            Math.round(
                milliseconds /
                    (1000 * 60)
            )
        );

    if (minutes < 1) {
        return "<1 min";
    }

    return `${minutes} min`;
}


export default InterviewHistory;