import { useEffect, useState } from "react";

import { ArrowLeft, Settings } from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileForm from "../components/profile/ProfileForm";

import { getCurrentUser, getInterviews, getResumes } from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  const [interviews, setInterviews] = useState([]);

  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // LOAD PROFILE DATA
  // ========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        setError("");

        const [userData, interviewData, resumeData] = await Promise.all([
          getCurrentUser(),
          getInterviews(),
          getResumes(),
        ]);

        setUser(userData.user);

        setInterviews(interviewData.interviews || []);

        setResumes(resumeData.resumes || []);

        // Keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(userData.user));
      } catch (error) {
        console.error("PROFILE LOAD ERROR:", error);

        setError(error.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ========================================
  // PROFILE UPDATED
  // ========================================

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-sm font-medium text-slate-400">Account</p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Profile Settings
            </h1>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <ProfileHeader
          name={user?.name || "User"}
          email={user?.email || ""}
          profileImage={user?.profileImage || ""}
          onProfileImageUpdated={handleProfileUpdated}
          onError={setError}
        />

        <ProfileStats interviews={interviews} resumes={resumes} />

        {user && (
          <ProfileForm
            user={user}
            onProfileUpdated={handleProfileUpdated}
            onError={setError}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Profile;
