import {
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    FileText,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeScore from "../components/resume/ResumeScore";
import ResumeAnalysis from "../components/resume/ResumeAnalysis";

function ResumeAnalyzer() {
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

                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                <Sparkles size={20} />
                            </div>

                            <span className="text-sm font-semibold text-slate-500">
                                AI Resume Analysis
                            </span>
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Optimize your resume
                        </h1>

                        <p className="mt-2 max-w-2xl text-slate-500">
                            Upload your resume and get AI-powered
                            feedback on your skills, experience,
                            strengths and areas for improvement.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck size={16} />
                        Your resume stays private
                    </div>
                </div>
            </section>

            {/* Upload */}
            <section className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                    <FileText size={18} />

                    <h2 className="font-bold text-slate-900">
                        Upload Resume
                    </h2>
                </div>

                <ResumeUpload />
            </section>

            {/* Static Analysis */}
            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Resume Analysis
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Example analysis — this will become dynamic
                        after we connect the AI backend.
                    </p>
                </div>

                <ResumeScore />

                <div className="mt-6">
                    <ResumeAnalysis />
                </div>
            </section>
        </DashboardLayout>
    );
}

export default ResumeAnalyzer;