import {
    CheckCircle2,
    CalendarDays,
} from "lucide-react";


function InterviewResultHeader({
    result,
}) {

    const completedDate =
        result?.completedAt
            ? new Date(
                  result.completedAt
              ).toLocaleDateString(
                  "en-IN",
                  {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                  }
              )
            : "Today";


    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50">

                        <CheckCircle2
                            size={28}
                            className="text-green-600"
                        />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-green-600">
                            Interview Completed
                        </p>


                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Great job! Here's your result.
                        </h1>


                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

                            {result?.targetRole
                                ? `Your ${result.targetRole} interview has been completed.`
                                : "Review your performance, understand your strengths and see where you can improve."}

                        </p>

                    </div>

                </div>


                <div className="flex items-center gap-2 text-xs text-slate-400">

                    <CalendarDays size={15} />

                    <span>
                        {completedDate}
                        {" · "}
                        {result?.totalQuestions || 0}
                        {" questions"}
                    </span>

                </div>

            </div>

        </div>
    );
}


export default InterviewResultHeader;