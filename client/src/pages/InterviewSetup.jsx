import { useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Code2,
  Brain,
  Layers3,
  Gauge,
  Mic2,
  Keyboard,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import InterviewOption from "../components/interview/InterviewOption";
import InterviewSummary from "../components/interview/InterviewSummary";

import { createInterview } from "../services/api";

function InterviewSetup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");

  const [experience, setExperience] = useState("fresher");

  const [type, setType] = useState("mixed");

  const [difficulty, setDifficulty] = useState("medium");

  const [questions, setQuestions] = useState(10);

  const [mode, setMode] = useState("voice");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleStartInterview = async () => {
    if (!role.trim()) {
      setError("Please select or enter a target role.");

      return;
    }

    try {
      setError("");

      setLoading(true);

      const data = await createInterview({
        targetRole: role.trim(),

        interviewType: type,

        difficulty: difficulty,

        totalQuestions: Number(questions),

        experienceLevel: experience,

        mode: mode,
      });

      console.log("Created interview:", data);

      const interviewId = data.interview?.id || data.interview?._id;

      if (!interviewId) {
        throw new Error("Interview ID was not returned by the server.");
      }

      navigate(`/interview/live/${interviewId}`);
    } catch (error) {
      console.error("CREATE INTERVIEW ERROR:", error);

      setError(error.message || "Failed to create interview.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Mic2 size={21} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">AI Interview</p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Prepare for your interview
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-slate-500">
          Customize your interview based on the role, experience level and
          difficulty you want to practice.
        </p>
      </section>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Configuration */}
        <div className="space-y-6 xl:col-span-2">
          {/* Role */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Target Role"
              description="What position are you preparing for?"
            />

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job role
              </label>

              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. MERN Stack Developer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Frontend Developer",
                  "MERN Stack Developer",
                  "Backend Developer",
                  "Software Engineer",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setRole(suggestion)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={Layers3}
              title="Experience Level"
              description="Tell the AI how experienced you are."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InterviewOption
                label="Fresher"
                description="Preparing for your first job"
                selected={experience === "fresher"}
                onClick={() => setExperience("fresher")}
              />

              <InterviewOption
                label="0–2 Years"
                description="Early career professional"
                selected={experience === "0-2"}
                onClick={() => setExperience("0-2")}
              />

              <InterviewOption
                label="2–5 Years"
                description="Mid-level professional"
                selected={experience === "2-5"}
                onClick={() => setExperience("2-5")}
              />

              <InterviewOption
                label="5+ Years"
                description="Experienced professional"
                selected={experience === "5+"}
                onClick={() => setExperience("5+")}
              />
            </div>
          </section>

          {/* Interview Type */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={Code2}
              title="Interview Type"
              description="What kind of questions do you want?"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <InterviewOption
                label="Technical"
                description="Coding, concepts and technical knowledge"
                icon={Code2}
                selected={type === "technical"}
                onClick={() => setType("technical")}
              />

              <InterviewOption
                label="Behavioral"
                description="Communication and situational questions"
                icon={Brain}
                selected={type === "behavioral"}
                onClick={() => setType("behavioral")}
              />

              <InterviewOption
                label="Mixed"
                description="Technical + behavioral"
                icon={Layers3}
                selected={type === "mixed"}
                onClick={() => setType("mixed")}
              />
            </div>
          </section>

          {/* Difficulty */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={Gauge}
              title="Difficulty"
              description="Choose how challenging the interview should be."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <InterviewOption
                label="Easy"
                description="Fundamental questions"
                selected={difficulty === "easy"}
                onClick={() => setDifficulty("easy")}
              />

              <InterviewOption
                label="Medium"
                description="Real interview level"
                selected={difficulty === "medium"}
                onClick={() => setDifficulty("medium")}
              />

              <InterviewOption
                label="Hard"
                description="Challenging questions"
                selected={difficulty === "hard"}
                onClick={() => setDifficulty("hard")}
              />
            </div>
          </section>

          {/* Questions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={Layers3}
              title="Number of Questions"
              description="How long should your interview be?"
            />

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[5, 10, 15].map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setQuestions(number)}
                  className={`rounded-xl border p-4 text-center transition ${
                    questions === number
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <span className="block text-xl font-bold">{number}</span>

                  <span
                    className={`mt-1 block text-xs ${
                      questions === number ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    Questions
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Mode */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={Mic2}
              title="Interview Mode"
              description="Choose how you want to answer."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InterviewOption
                label="Voice Interview"
                description="Speak naturally using your microphone"
                icon={Mic2}
                selected={mode === "voice"}
                onClick={() => setMode("voice")}
              />

              <InterviewOption
                label="Text Interview"
                description="Type your answers instead"
                icon={Keyboard}
                selected={mode === "text"}
                onClick={() => setMode("text")}
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <div>
          <InterviewSummary
            role={role}
            experience={experience}
            type={type}
            difficulty={difficulty}
            questions={questions}
            mode={mode}
            onStart={handleStartInterview}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <Icon size={19} className="text-slate-700" />
      </div>

      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default InterviewSetup;
