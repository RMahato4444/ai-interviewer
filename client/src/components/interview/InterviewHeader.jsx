import {
    BrainCircuit,
    Clock3,
    CircleHelp,
    LogOut,
} from "lucide-react";

function InterviewHeader({
    currentQuestion,
    totalQuestions,
    elapsedTime,
    onExit,
}) {
    const progress =
        (currentQuestion / totalQuestions) * 100;

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <BrainCircuit size={20} />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">
                                InterviewAI
                            </p>

                            <p className="text-xs text-slate-400">
                                Live Interview
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex flex-1 items-center justify-center gap-3">
                        <CircleHelp
                            size={17}
                            className="text-slate-400"
                        />

                        <div className="hidden w-48 sm:block">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-slate-600">
                                    Question {currentQuestion}
                                </span>

                                <span className="text-slate-400">
                                    {totalQuestions}
                                </span>
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-slate-900 transition-all"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <span className="text-sm font-semibold text-slate-700 sm:hidden">
                            {currentQuestion}/{totalQuestions}
                        </span>
                    </div>

                    {/* Timer + Exit */}
                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 sm:flex">
                            <Clock3
                                size={16}
                                className="text-slate-500"
                            />

                            <span className="font-mono text-sm font-medium text-slate-700">
                                {elapsedTime}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onExit}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={16} />

                            <span className="hidden sm:inline">
                                Exit
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default InterviewHeader;