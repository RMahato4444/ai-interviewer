import {
    Mic,
    MicOff,
    Keyboard,
} from "lucide-react";

function AnswerBox({
    answer,
    setAnswer,
    listening,
    onToggleListening,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-900">
                        Your Answer
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Speak naturally or type your answer.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                    <Keyboard
                        size={14}
                        className="text-slate-500"
                    />

                    <span className="text-xs font-medium text-slate-500">
                        Text / Voice
                    </span>
                </div>
            </div>

            {/* Answer */}
            <div className="relative mt-5">
                <textarea
                    value={answer}
                    onChange={(event) =>
                        setAnswer(event.target.value)
                    }
                    placeholder="Type your answer here..."
                    rows={7}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 pr-5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
                />

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {answer.length} characters
                    </span>

                    <button
                        type="button"
                        onClick={onToggleListening}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            listening
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                    >
                        {listening ? (
                            <MicOff size={17} />
                        ) : (
                            <Mic size={17} />
                        )}

                        {listening
                            ? "Stop Listening"
                            : "Start Speaking"}
                    </button>
                </div>
            </div>

            {/* Listening status */}
            {listening && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-700">
                            Listening...
                        </p>

                        <p className="text-xs text-red-500">
                            Speak clearly. Your answer will appear
                            here.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AnswerBox;