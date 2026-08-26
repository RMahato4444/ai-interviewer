import { useEffect } from "react";

import { checkServer } from "../services/api";
import {
    FileCheck2,
    Mic2,
    Trophy,
    Target,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import PerformanceCard from "../components/dashboard/PerformanceCard";

function Dashboard() {
    useEffect(() => {
    checkServer()
        .then((data) => {
            console.log("Backend:", data);
        })
        .catch((error) => {
            console.error(
                "Backend connection failed:",
                error
            );
        });
}, []);
    return (
        <DashboardLayout>
            {/* Header */}
            <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Tuesday, August 25, 2026
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Good morning, Rahul 👋
                    </h1>

                    <p className="mt-2 max-w-xl text-slate-500">
                        Keep practicing. Your next interview could
                        be the one that changes everything.
                    </p>
                </div>

                <Link
                    to="/interview/setup"
                    className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Start Interview
                    <ArrowRight size={17} />
                </Link>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                    title="Resume Score"
                    value="85%"
                    description="+8% since last analysis"
                    icon={FileCheck2}
                />

                <StatsCard
                    title="Interviews"
                    value="12"
                    description="3 this week"
                    icon={Mic2}
                />

                <StatsCard
                    title="Average Score"
                    value="78%"
                    description="+5% from last month"
                    icon={Trophy}
                />

                <StatsCard
                    title="Interview Readiness"
                    value="82%"
                    description="You're almost ready"
                    icon={Target}
                />
            </section>

            {/* Quick Actions */}
            <section className="mt-6">
                <QuickActions />
            </section>

            {/* Bottom section */}
            <section className="mt-6 grid gap-6 xl:grid-cols-5">
                <div className="xl:col-span-3">
                    <RecentInterviews />
                </div>

                <div className="xl:col-span-2">
                    <PerformanceCard />
                </div>
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;