import {
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
} from "lucide-react";

function FeedbackCard() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Strengths */}
            <FeedbackSection
                icon={CheckCircle2}
                title="Strengths"
                items={[
                    "Explained technical concepts clearly.",
                    "Used relevant examples from projects.",
                    "Demonstrated good understanding of React and Node.js.",
                    "Maintained a structured answer format.",
                ]}
            />

            {/* Improvements */}
            <FeedbackSection
                icon={AlertTriangle}
                title="Areas to Improve"
                items={[
                    "Some answers could be more concise.",
                    "Give more measurable results when discussing projects.",
                    "Improve depth when explaining backend architecture.",
                    "Avoid repeating the same points.",
                ]}
            />

            {/* Recommendations */}
            <FeedbackSection
                icon={Lightbulb}
                title="AI Recommendations"
                items={[
                    "Practice explaining system design concepts.",
                    "Use the STAR method for behavioral questions.",
                    "Practice answering technical questions within 2 minutes.",
                    "Review Node.js performance and database optimization.",
                ]}
            />
        </div>
    );
}

function FeedbackSection({
    icon: Icon,
    title,
    items,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Icon size={19} className="text-slate-700" />
                </div>

                <h2 className="font-bold text-slate-900">
                    {title}
                </h2>
            </div>

            <div className="mt-5 space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-3"
                    >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />

                        <p className="text-sm leading-6 text-slate-600">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeedbackCard;