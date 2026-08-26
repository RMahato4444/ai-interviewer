import {
    Bot,
    Volume2,
} from "lucide-react";

function QuestionCard({
    question,
    isSpeaking,
    onSpeak,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* AI identity */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <Bot size={22} />
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            AI Interviewer
                        </p>

                        <p className="text-xs text-slate-400">
                            Technical Interview
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onSpeak}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        isSpeaking
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                    <Volume2 size={15} />

                    {isSpeaking
                        ? "Speaking..."
                        : "Read question"}
                </button>
            </div>

            {/* Question */}
            <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Interview Question
                </p>

                <h1 className="mt-3 text-2xl font-bold leading-9 tracking-tight text-slate-900 sm:text-3xl">
                    {question}
                </h1>
            </div>

            {/* Speaking indicator */}
            <div className="mt-7 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        isSpeaking
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-500"
                    }`}
                >
                    <Volume2 size={17} />
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        {isSpeaking
                            ? "AI is speaking"
                            : "Listen to the question"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                        You can replay the question anytime.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default QuestionCard;