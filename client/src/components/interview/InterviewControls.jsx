import {
    ArrowRight,
    Check,
    Flag,
} from "lucide-react";

function InterviewControls({
    answer,
    onSubmit,
    isLastQuestion,
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
                <Flag size={16} />
                Flag Question
            </button>

            <button
                type="button"
                disabled={!answer.trim()}
                onClick={onSubmit}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {isLastQuestion ? (
                    <>
                        Finish Interview
                        <Check size={17} />
                    </>
                ) : (
                    <>
                        Submit & Continue
                        <ArrowRight size={17} />
                    </>
                )}
            </button>
        </div>
    );
}

export default InterviewControls;