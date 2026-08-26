import {
    Search,
    SlidersHorizontal,
} from "lucide-react";

function InterviewHistoryFilters({
    search,
    setSearch,
    type,
    setType,
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
                <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search interviews..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-900"
                />
            </div>

            <div className="relative">
                <SlidersHorizontal
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                    value={type}
                    onChange={(event) =>
                        setType(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-slate-900 sm:w-48"
                >
                    <option value="all">
                        All Interviews
                    </option>

                    <option value="technical">
                        Technical
                    </option>

                    <option value="behavioral">
                        Behavioral
                    </option>

                    <option value="mixed">
                        Mixed
                    </option>
                </select>
            </div>
        </div>
    );
}

export default InterviewHistoryFilters;