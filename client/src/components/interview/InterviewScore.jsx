import {
    Brain,
    MessageSquare,
    Lightbulb,
    ShieldCheck,
} from "lucide-react";


function InterviewScore({
    result,
}) {

    const questions =
        result?.questions || [];


    // ========================================
    // CALCULATE CATEGORY SCORES
    // ========================================

    const getCategoryScore = (
        categories
    ) => {

        const matchingQuestions =
            questions.filter(
                (question) =>
                    categories.includes(
                        question.category
                    ) &&
                    typeof question.score ===
                        "number"
            );


        if (
            matchingQuestions.length === 0
        ) {
            return null;
        }


        const total =
            matchingQuestions.reduce(
                (sum, question) =>
                    sum + question.score,
                0
            );


        return Math.round(
            total /
                matchingQuestions.length
        );
    };


    const technicalScore =
        getCategoryScore([
            "Technical",
        ]);


    const problemSolvingScore =
        getCategoryScore([
            "Problem Solving",
        ]);


    const behavioralScore =
        getCategoryScore([
            "Behavioral",
            "HR",
        ]);


    const categories = [
        {
            title:
                "Technical Knowledge",

            score:
                technicalScore,

            icon:
                Brain,
        },

        {
            title:
                "Behavioral",

            score:
                behavioralScore,

            icon:
                MessageSquare,
        },

        {
            title:
                "Problem Solving",

            score:
                problemSolvingScore,

            icon:
                Lightbulb,
        },

        {
            title:
                "Overall Performance",

            score:
                result?.overallScore ?? 0,

            icon:
                ShieldCheck,
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

                        {result?.overallScore ??
                            0}

                    </span>


                    <span className="mb-2 text-xl text-slate-400">
                        / 100
                    </span>

                </div>


                <p className="mt-4 text-sm leading-6 text-slate-300">

                    {result?.overallFeedback ||
                        "Your overall interview performance has been evaluated by the AI interviewer."}

                </p>


                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{
                            width: `${
                                result?.overallScore ||
                                0
                            }%`,
                        }}
                    />

                </div>


                <div className="mt-3 flex justify-between text-xs">

                    <span className="text-slate-400">
                        Needs improvement
                    </span>

                    <span className="font-medium text-white">

                        {(result?.overallScore ??
                            0) >= 80
                            ? "Strong"
                            : (result?.overallScore ??
                                0) >= 60
                            ? "Good"
                            : "Needs Practice"}

                    </span>

                </div>

            </div>


            {/* Category scores */}

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">

                {categories.map(
                    (category) => {

                        const Icon =
                            category.icon;

                        return (
                            <div
                                key={
                                    category.title
                                }
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
                                                {
                                                    category.title
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Based on interview responses
                                            </p>

                                        </div>

                                    </div>


                                    <span className="text-lg font-bold text-slate-900">

                                        {category.score ??
                                            "—"}

                                    </span>

                                </div>


                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-slate-900 transition-all"
                                        style={{
                                            width: `${
                                                category.score ??
                                                0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>
                        );

                    }
                )}

            </div>

        </div>
    );
}


export default InterviewScore;