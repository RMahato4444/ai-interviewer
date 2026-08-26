import {
    ArrowLeft,
    RotateCcw,
    LayoutDashboard,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import InterviewResultHeader from "../components/interview/InterviewResultHeader";
import InterviewScore from "../components/interview/InterviewScore";
import FeedbackCard from "../components/interview/FeedbackCard";
import QuestionReview from "../components/interview/QuestionReview";

function InterviewResult() {
    const navigate = useNavigate();

    const handleTryAgain = () => {
        navigate("/interview/setup");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top navigation */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                        Dashboard
                    </Link>

                    <div className="text-sm font-bold text-slate-900">
                        Interview Results
                    </div>

                    <div className="w-20" />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                {/* Header */}
                <InterviewResultHeader />

                {/* Score */}
                <section className="mt-6">
                    <InterviewScore />
                </section>

                {/* Feedback */}
                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            AI Performance Feedback
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Understand what went well and what you
                            should focus on next.
                        </p>
                    </div>

                    <FeedbackCard />
                </section>

                {/* Questions */}
                <section className="mt-10">
                    <QuestionReview />
                </section>

                {/* Actions */}
                <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Ready for another round?
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Practice again to improve your score.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleTryAgain}
                                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                <RotateCcw size={16} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default InterviewResult;