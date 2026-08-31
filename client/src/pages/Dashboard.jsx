import { useEffect, useState } from "react";

import { FileCheck2, Mic2, Trophy, Target, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import PerformanceCard from "../components/dashboard/PerformanceCard";

import { getInterviews, getResumes } from "../services/api";

function Dashboard() {
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      const user = storedUser ? JSON.parse(storedUser) : null;

      return user?.name || "there";
    } catch {
      return "there";
    }
  });

  const [interviews, setInterviews] = useState([]);

  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        setError("");

        const [interviewData, resumeData] = await Promise.all([
          getInterviews(),
          getResumes(),
        ]);

        setInterviews(interviewData.interviews || []);

        setResumes(resumeData.resumes || []);
      } catch (error) {
        console.error("DASHBOARD LOAD ERROR:", error);

        setError(error.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ========================================
  // COMPLETED INTERVIEWS
  // ========================================

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed",
  );

  // ========================================
  // INTERVIEW COUNT
  // ========================================

  const interviewCount = completedInterviews.length;

  // ========================================
  // AVERAGE SCORE
  // ========================================

  const scores = completedInterviews
    .map((interview) => interview.overallScore)
    .filter((score) => typeof score === "number");

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : null;

  // ========================================
  // LATEST RESUME SCORE
  // ========================================

  const analyzedResumes = resumes
    .filter((resume) => typeof resume?.aiAnalysis?.overallScore === "number")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const resumeScore =
    analyzedResumes.length > 0
      ? analyzedResumes[0].aiAnalysis.overallScore
      : null;

  // ========================================
  // INTERVIEW READINESS
  // ========================================

  const readinessScore = averageScore ?? resumeScore ?? null;

  const readinessDescription =
    readinessScore === null
      ? "Complete an interview to get a score"
      : readinessScore >= 85
        ? "You're interview ready"
        : readinessScore >= 70
          ? "Good progress — keep practicing"
          : "More practice recommended";

  // ========================================
  // THIS WEEK
  // ========================================

  const interviewsThisWeek = completedInterviews.filter((interview) => {
    const interviewDate = new Date(
      interview.completedAt || interview.createdAt,
    );

    const now = new Date();

    const sevenDaysAgo = new Date(now);

    sevenDaysAgo.setDate(now.getDate() - 7);

    return interviewDate >= sevenDaysAgo;
  }).length;

  return (
    <DashboardLayout>
      {/* Header */}

      <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {formatDashboardDate()}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Good morning, {userName} 👋
          </h1>

          <p className="mt-2 max-w-xl text-slate-500">
            Keep practicing. Your next interview could be the one that changes
            everything.
          </p>
        </div>

        <Link
          to="/interview/setup"
          className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start Interview
          <ArrowRight size={17} />
        </Link>
      </section>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Resume Score"
          value={resumeScore !== null ? `${resumeScore}%` : "—"}
          description={
            resumeScore !== null
              ? "Latest AI resume analysis"
              : "Analyze your resume"
          }
          icon={FileCheck2}
        />

        <StatsCard
          title="Interviews"
          value={loading ? "..." : interviewCount}
          description={
            loading ? "Loading..." : `${interviewsThisWeek} this week`
          }
          icon={Mic2}
        />

        <StatsCard
          title="Average Score"
          value={averageScore !== null ? `${averageScore}%` : "—"}
          description={
            scores.length > 0
              ? "Based on completed interviews"
              : "Complete an interview first"
          }
          icon={Trophy}
        />

        <StatsCard
          title="Interview Readiness"
          value={readinessScore !== null ? `${readinessScore}%` : "—"}
          description={readinessDescription}
          icon={Target}
        />
      </section>

      {/* Quick Actions */}

      <section className="mt-6">
        <QuickActions />
      </section>

      {/* Bottom section */}

      <section className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentInterviews interviews={completedInterviews} />
        </div>

        <div className="xl:col-span-2">
          <PerformanceCard interviews={completedInterviews} />
        </div>
      </section>
    </DashboardLayout>
  );
}

// ========================================
// DASHBOARD DATE
// ========================================

function formatDashboardDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default Dashboard;
