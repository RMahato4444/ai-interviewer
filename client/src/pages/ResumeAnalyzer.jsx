import {
    useState,
} from "react";

import {
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    FileText,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeScore from "../components/resume/ResumeScore";
import ResumeAnalysis from "../components/resume/ResumeAnalysis";

import {
    analyzeResume,
} from "../services/api";


function ResumeAnalyzer() {

    const [resume, setResume] =
        useState(null);

    const [analysis, setAnalysis] =
        useState(null);

    const [analyzing, setAnalyzing] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================
    // RESUME UPLOAD SUCCESS
    // ========================================

    const handleUploadSuccess =
        (uploadedResume) => {

            setResume(
                uploadedResume
            );

            setAnalysis(null);

            setError("");
        };


    // ========================================
    // ANALYZE RESUME
    // ========================================

    const handleAnalyze =
        async () => {

            if (!resume?.id) {

                setError(
                    "Please upload a resume first."
                );

                return;
            }

            try {

                setAnalyzing(true);

                setError("");

                const data =
                    await analyzeResume(
                        resume.id
                    );

                setAnalysis(
                    data.analysis
                );

            } catch (error) {

                console.error(
                    "RESUME ANALYSIS ERROR:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to analyze resume."
                );

            } finally {

                setAnalyzing(false);

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


            {/* Error */}

            {error && (

                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>

            )}


            {/* Upload */}

            <section className="mb-8">

                <div className="mb-3 flex items-center gap-2">

                    <FileText size={18} />

                    <h2 className="font-bold text-slate-900">
                        Upload Resume
                    </h2>

                </div>


                <ResumeUpload
                    onUploadSuccess={
                        handleUploadSuccess
                    }

                    onError={
                        setError
                    }

                    resume={
                        resume
                    }

                    onRemove={() => {

                        setResume(
                            null
                        );

                        setAnalysis(
                            null
                        );

                    }}
                />

            </section>


            {/* Analysis */}

            {resume && (

                <section>

                    <div className="mb-5">

                        <h2 className="text-xl font-bold text-slate-900">
                            Resume Analysis
                        </h2>


                        <p className="mt-1 text-sm text-slate-500">

                            {analysis
                                ? "AI-powered analysis of your resume."
                                : "Your resume has been uploaded. Analyze it to get AI-powered feedback."}

                        </p>

                    </div>


                    {!analysis && (

                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h3 className="font-bold text-slate-900">
                                        {resume.originalName}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Resume uploaded successfully.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleAnalyze
                                    }
                                    disabled={
                                        analyzing
                                    }
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {analyzing
                                        ? "Analyzing Resume..."
                                        : "Analyze Resume"}

                                </button>

                            </div>

                        </div>

                    )}


                    {analysis && (

                        <>
                            <ResumeScore
                                analysis={
                                    analysis
                                }
                            />

                            <div className="mt-6">

                                <ResumeAnalysis
                                    analysis={
                                        analysis
                                    }
                                />

                            </div>
                        </>

                    )}

                </section>

            )}

        </DashboardLayout>
    );
}


export default ResumeAnalyzer;