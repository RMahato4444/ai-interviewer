import {
    ArrowLeft,
    Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileForm from "../components/profile/ProfileForm";

function Profile() {
    return (
        <DashboardLayout>
            <section className="mb-8">
                <Link
                    to="/dashboard"
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Settings size={19} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-400">
                            Account
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Profile Settings
                        </h1>
                    </div>
                </div>
            </section>

            <div className="space-y-6">
                <ProfileHeader
                    name="Rahul Mahato"
                    email="rahul@example.com"
                />

                <ProfileStats />

                <ProfileForm />
            </div>
        </DashboardLayout>
    );
}

export default Profile;