import {
    Camera,
    UserRound,
} from "lucide-react";

function ProfileHeader({
    name,
    email,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-white">
                        <UserRound size={40} />
                    </div>

                    <button
                        type="button"
                        className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                        <Camera size={16} />
                    </button>
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-400">
                        Your Profile
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        {name}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {email}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            Job Seeker
                        </span>

                        <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                            Profile Active
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileHeader;