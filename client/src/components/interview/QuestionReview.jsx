import {
    ChevronDown,
    CheckCircle2,
} from "lucide-react";

function QuestionReview() {
    const questions = [
        {
            question:
                "Can you explain how the event loop works in JavaScript?",
            score: 85,
            feedback:
                "Good explanation of the call stack and asynchronous operations. Mentioning the microtask queue would make the answer stronger.",
            answer:
                "The event loop allows JavaScript to handle asynchronous operations without blocking the main thread.",
        },
        {
            question:
                "What is the difference between let, const and var?",
            score: 92,
            feedback:
                "Excellent answer. You correctly explained scope, reassignment and hoisting.",
            answer:
                "let and const are block scoped while var is function scoped. Const cannot be reassigned after initialization.",
        },
        {
            question:
                "How does React's virtual DOM work?",
            score: 76,
            feedback:
                "The main concept was correct, but the explanation of reconciliation could be more detailed.",
            answer:
                "React maintains a virtual representation of the UI and compares changes before updating the actual DOM.",
        },
        {
            question:
                "How would you design a REST API using Node.js and Express?",
            score: 80,
            feedback:
                "Good understanding of routes and controllers. Consider discussing validation, authentication and error handling.",
            answer:
                "I would separate routes, controllers and services and expose REST endpoints through Express.",
        },
    ];

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                    Question-by-Question Review
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    See how the AI evaluated each answer.
                </p>
            </div>

            <div className="space-y-3">
                {questions.map((item, index) => (
                    <QuestionItem
                        key={index}
                        number={index + 1}
                        {...item}
                    />
                ))}
            </div>
        </section>
    );
}

function QuestionItem({
    number,
    question,
    score,
    feedback,
    answer,
}) {
    return (
        <details className="group rounded-2xl border border-slate-200 bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                    {number}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                        {question}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2
                            size={14}
                            className="text-green-600"
                        />

                        <span className="text-xs text-slate-400">
                            Answer evaluated
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">
                        {score}
                    </span>

                    <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform group-open:rotate-180"
                    />
                </div>
            </summary>

            <div className="border-t border-slate-100 px-5 pb-5 pt-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Your Answer
                        </p>

                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {answer}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            AI Feedback
                        </p>

                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {feedback}
                        </p>
                    </div>
                </div>
            </div>
        </details>
    );
}

export default QuestionReview;