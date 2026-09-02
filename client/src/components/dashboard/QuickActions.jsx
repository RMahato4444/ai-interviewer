import { FileUp, Mic2, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Link
        to="/interview/setup"
        className="group rounded-2xl bg-slate-900 p-6 text-white transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Mic2 size={23} />
          </div>

          <ArrowRight
            size={20}
            className="transition group-hover:translate-x-1"
          />
        </div>

        <h3 className="mt-6 text-xl font-bold">Start AI Interview</h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Practice a realistic interview tailored to your target job role and
          experience.
        </p>

        <div className="mt-6 text-sm font-semibold">Start practicing →</div>
      </Link>

      <Link
        to="/resume"
        className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <FileUp size={23} />
          </div>

          <ArrowRight
            size={20}
            className="text-slate-400 transition group-hover:translate-x-1"
          />
        </div>

        <h3 className="mt-6 text-xl font-bold text-slate-900">
          Analyze Your Resume
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Get AI-powered feedback on your resume, skills, experience and
          interview readiness.
        </p>

        <div className="mt-6 text-sm font-semibold text-slate-900">
          Analyze resume →
        </div>
      </Link>
    </div>
  );
}

export default QuickActions;
