import { useEffect, useState } from "react";

import { ArrowLeft, RotateCcw, LayoutDashboard } from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import InterviewResultHeader from "../components/interview/InterviewResultHeader";
import InterviewScore from "../components/interview/InterviewScore";
import FeedbackCard from "../components/interview/FeedbackCard";
import QuestionReview from "../components/interview/QuestionReview";

import { getInterviewResult } from "../services/api";

function InterviewResult() {
  const navigate = useNavigate();

  const { interviewId } = useParams();

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(!result);

  const [error, setError] = useState("");

  // ========================================
  // LOAD RESULT
  // ========================================

  useEffect(() => {
    const loadResult = async () => {
      if (!interviewId) {
        setError("Interview result could not be found.");

        setLoading(false);

        return;
      }

      // We already received the
      // result from LiveInterview.
      //
      // But we'll fetch it again from
      // the backend so refreshes and
      // future navigation can use the
      // database result.

      try {
        setLoading(true);

        const data = await getInterviewResult(interviewId);

        setResult(data.result);
      } catch (error) {
        console.error("GET RESULT ERROR:", error);

        setError(error.message || "Failed to load interview result.");
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [interviewId]);

  // ========================================
  // TRY AGAIN
  // ========================================

  const handleTryAgain = () => {
    navigate("/interview/setup");
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading your interview result...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load result
          </h2>

          <p className="mt-3 text-sm leading-6 text-red-600">
            {error || "Interview result is not available."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

        <InterviewResultHeader result={result} />

        {/* Score */}

        <section className="mt-6">
          <InterviewScore result={result} />
        </section>

        {/* Feedback */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              AI Performance Feedback
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Understand what went well and what you should focus on next.
            </p>
          </div>

          <FeedbackCard result={result} />
        </section>

        {/* Questions */}

        <section className="mt-10">
          <QuestionReview questions={result.questions} />
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
