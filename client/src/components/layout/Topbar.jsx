import {
    Menu,
    Bell,
    Search,
} from "lucide-react";

function Topbar({ setMobileOpen }) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                    <Search
                        size={17}
                        className="text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        RM
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">
                            Rahul Mahato
                        </p>

                        <p className="text-xs text-slate-500">
                            Candidate
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;