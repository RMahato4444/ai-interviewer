import {
    ArrowRight,
    Check,
    Flag,
    LoaderCircle,
} from "lucide-react";

function InterviewControls({
    answer,
    onSubmit,
    isLastQuestion,
    submitting,
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Flag size={16} />
                Flag Question
            </button>

            <button
                type="button"
                disabled={!answer.trim() || submitting}
                onClick={onSubmit}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {submitting ? (
                    <>
                        <LoaderCircle
                            size={17}
                            className="animate-spin"
                        />
                        Submitting...
                    </>
                ) : isLastQuestion ? (
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
