import {
    FileCheck2,
    Target,
    BriefcaseBusiness,
    Sparkles,
} from "lucide-react";


function ResumeScore({
    analysis,
}) {

    const overallScore =
        analysis?.overallScore ?? null;


    const scores = [
        {
            title: "ATS Score",
            value:
                typeof overallScore ===
                "number"
                    ? `${overallScore}`
                    : "—",
            description:
                "AI resume evaluation",
            icon: FileCheck2,
        },

        {
            title: "Skills Match",
            value:
                typeof overallScore ===
                "number"
                    ? `${overallScore}%`
                    : "—",
            description:
                "Based on detected skills",
            icon: Target,
        },

        {
            title: "Experience",
            value:
                analysis?.experienceSummary
                    ? "Ready"
                    : "—",
            description:
                analysis?.experienceSummary
                    ? "Experience detected"
                    : "Awaiting analysis",
            icon:
                BriefcaseBusiness,
        },

        {
            title: "AI Readiness",
            value:
                typeof overallScore ===
                "number"
                    ? `${overallScore}%`
                    : "—",
            description:
                overallScore >= 80
                    ? "Strong profile"
                    : overallScore >= 60
                    ? "Good foundation"
                    : "Needs improvement",
            icon: Sparkles,
        },
    ];


    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {scores.map(
                (score) => {

                    const Icon =
                        score.icon;

                    return (
                        <div
                            key={
                                score.title
                            }
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        {score.title}
                                    </p>


                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {score.value}
                                    </p>


                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            score.description
                                        }
                                    </p>

                                </div>


                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                                    <Icon
                                        size={19}
                                        className="text-slate-700"
                                    />

                                </div>

                            </div>

                        </div>
                    );

                }
            )}

        </div>
    );
}


export default ResumeScore;