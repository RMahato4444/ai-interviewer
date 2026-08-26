import {
    Brain,
    MessageSquare,
    Lightbulb,
    ShieldCheck,
} from "lucide-react";

function InterviewScore() {
    const categories = [
        {
            title: "Technical Knowledge",
            score: 78,
            icon: Brain,
        },
        {
            title: "Communication",
            score: 85,
            icon: MessageSquare,
        },
        {
            title: "Problem Solving",
            score: 88,
            icon: Lightbulb,
        },
        {
            title: "Confidence",
            score: 80,
            icon: ShieldCheck,
        },
    ];

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Overall */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white sm:p-8">
                <p className="text-sm font-medium text-slate-400">
                    Overall Score
                </p>

                <div className="mt-6 flex items-end gap-2">
                    <span className="text-6xl font-bold tracking-tight">
                        82
                    </span>

                    <span className="mb-2 text-xl text-slate-400">
                        / 100
                    </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                    Strong performance. You're showing good
                    technical understanding and communication.
                </p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-white"
                        style={{ width: "82%" }}
                    />
                </div>

                <div className="mt-3 flex justify-between text-xs">
                    <span className="text-slate-400">
                        Needs improvement
                    </span>

                    <span className="font-medium text-white">
                        Strong
                    </span>
                </div>
            </div>

            {/* Category scores */}
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <Icon
                                            size={18}
                                            className="text-slate-700"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {category.title}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            AI evaluation
                                        </p>
                                    </div>
                                </div>

                                <span className="text-lg font-bold text-slate-900">
                                    {category.score}
                                </span>
                            </div>

                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-slate-900"
                                    style={{
                                        width: `${category.score}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default InterviewScore;