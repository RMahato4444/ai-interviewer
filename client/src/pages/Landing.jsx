import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <h1 className="text-2xl font-bold">
                    InterviewAI
                </h1>

                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="rounded-lg px-4 py-2 text-slate-300 hover:text-white"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg bg-white px-5 py-2.5 font-semibold text-slate-900 hover:bg-slate-200"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-24">
                <div className="max-w-3xl">
                    <div className="mb-6 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
                        AI-powered interview preparation
                    </div>

                    <h2 className="text-5xl font-bold leading-tight md:text-7xl">
                        Practice interviews.
                        <br />
                        <span className="text-slate-400">
                            Get better jobs.
                        </span>
                    </h2>

                    <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
                        Upload your resume, practice realistic AI
                        interviews, and receive detailed feedback to
                        improve your performance.
                    </p>

                    <div className="mt-10 flex gap-4">
                        <Link
                            to="/register"
                            className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Start Practicing
                        </Link>

                        <Link
                            to="/login"
                            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Landing;