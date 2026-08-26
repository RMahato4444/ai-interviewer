import {
    Trophy,
    Target,
    FileText,
    Flame,
} from "lucide-react";

function ProfileStats() {
    const stats = [
        {
            label: "Interviews",
            value: "12",
            icon: Trophy,
        },
        {
            label: "Average Score",
            value: "78%",
            icon: Target,
        },
        {
            label: "Resumes Analyzed",
            value: "4",
            icon: FileText,
        },
        {
            label: "Practice Streak",
            value: "6 days",
            icon: Flame,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {stat.value}
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
            })}
        </div>
    );
}

export default ProfileStats;