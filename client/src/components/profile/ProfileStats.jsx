import {
    Trophy,
    Target,
    FileText,
    Flame,
} from "lucide-react";


function ProfileStats({
    interviews = [],
    resumes = [],
}) {

    const completedInterviews =
        interviews.filter(
            (interview) =>
                interview.status ===
                "completed"
        );


    const scores =
        completedInterviews
            .map(
                (interview) =>
                    interview.overallScore
            )
            .filter(
                (score) =>
                    typeof score ===
                    "number"
            );


    const averageScore =
        scores.length > 0
            ? Math.round(
                  scores.reduce(
                      (sum, score) =>
                          sum + score,
                      0
                  ) /
                      scores.length
              )
            : null;


    const stats = [
        {
            label: "Interviews",

            value:
                completedInterviews.length,

            icon: Trophy,
        },

        {
            label: "Average Score",

            value:
                averageScore !== null
                    ? `${averageScore}%`
                    : "—",

            icon: Target,
        },

        {
            label:
                "Resumes Analyzed",

            value:
                resumes.filter(
                    (resume) =>
                        resume?.aiAnalysis
                            ?.overallScore !==
                        null &&
                        resume?.aiAnalysis
                            ?.overallScore !==
                        undefined
                ).length,

            icon: FileText,
        },

        {
            label:
                "Practice Streak",

            value:
                calculatePracticeStreak(
                    completedInterviews
                ),

            icon: Flame,
        },
    ];


    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map(
                (stat) => {

                    const Icon =
                        stat.icon;

                    return (
                        <div
                            key={
                                stat.label
                            }
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs font-medium text-slate-400">
                                        {
                                            stat.label
                                        }
                                    </p>


                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {
                                            stat.value
                                        }
                                    </p>

                                </div>


                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                                    <Icon
                                        size={18}
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


// ========================================
// PRACTICE STREAK
// ========================================

function calculatePracticeStreak(
    interviews
) {

    if (
        interviews.length ===
        0
    ) {
        return "0 days";
    }


    const uniqueDays =
        [
            ...new Set(
                interviews
                    .map(
                        (
                            interview
                        ) => {

                            const value =
                                interview.completedAt ||
                                interview.createdAt;

                            if (!value) {
                                return null;
                            }

                            const date =
                                new Date(
                                    value
                                );

                            if (
                                Number.isNaN(
                                    date.getTime()
                                )
                            ) {
                                return null;
                            }

                            return date
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                );
                        }
                    )
                    .filter(Boolean)
            ),
        ];


    if (
        uniqueDays.length ===
        0
    ) {
        return "0 days";
    }


    uniqueDays.sort(
        (a, b) =>
            new Date(b) -
            new Date(a)
    );


    let streak = 1;


    for (
        let index = 1;
        index <
        uniqueDays.length;
        index++
    ) {

        const previous =
            new Date(
                uniqueDays[index - 1]
            );

        const current =
            new Date(
                uniqueDays[index]
            );


        const difference =
            (
                previous -
                current
            ) /
            (
                1000 *
                60 *
                60 *
                24
            );


        if (
            Math.round(
                difference
            ) === 1
        ) {

            streak++;

        } else {

            break;

        }
    }


    return `${streak} day${
        streak === 1
            ? ""
            : "s"
    }`;
}


export default ProfileStats;