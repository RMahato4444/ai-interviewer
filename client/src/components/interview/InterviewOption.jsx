function InterviewOption({
    label,
    description,
    selected,
    onClick,
    icon: Icon,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border p-4 text-left transition ${
                selected
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50"
            }`}
        >
            <div className="flex items-start gap-3">
                {Icon && (
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            selected
                                ? "bg-white/10"
                                : "bg-slate-100"
                        }`}
                    >
                        <Icon size={19} />
                    </div>
                )}

                <div className="min-w-0">
                    <p className="text-sm font-semibold">
                        {label}
                    </p>

                    {description && (
                        <p
                            className={`mt-1 text-xs leading-5 ${
                                selected
                                    ? "text-slate-300"
                                    : "text-slate-500"
                            }`}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}

export default InterviewOption;