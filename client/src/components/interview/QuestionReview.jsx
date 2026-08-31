import {
    ChevronDown,
    CheckCircle2,
} from "lucide-react";


function QuestionReview({
    questions = [],
}) {

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


            {questions.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">

                    <p className="text-sm text-slate-500">
                        No question data is available.
                    </p>

                </div>

            ) : (

                <div className="space-y-3">

                    {questions.map(
                        (
                            item,
                            index
                        ) => (

                            <QuestionItem
                                key={
                                    item._id ||
                                    index
                                }

                                number={
                                    index + 1
                                }

                                question={
                                    item.question
                                }

                                score={
                                    item.score
                                }

                                feedback={
                                    item.feedback
                                }

                                answer={
                                    item.answer
                                }
                            />

                        )
                    )}

                </div>

            )}

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

                        {typeof score ===
                        "number"
                            ? score
                            : "—"}

                    </span>


                    <ChevronDown
                        size={18}
                        className="text-slate-400 transition-transform group-open:rotate-180"
                    />

                </div>

            </summary>


            <div className="border-t border-slate-100 px-5 pb-5 pt-5">

                <div className="grid gap-5 md:grid-cols-2">

                    {/* USER ANSWER */}

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Your Answer
                        </p>


                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">

                            {answer ||
                                "No answer recorded."}

                        </p>

                    </div>


                    {/* AI FEEDBACK */}

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            AI Feedback
                        </p>


                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">

                            {feedback ||
                                "No feedback recorded."}

                        </p>

                    </div>

                </div>

            </div>

        </details>
    );
}


export default QuestionReview;