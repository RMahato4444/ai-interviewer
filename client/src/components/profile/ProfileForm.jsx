import {
    useState,
} from "react";

import {
    Save,
    User,
    Mail,
    BriefcaseBusiness,
    GraduationCap,
} from "lucide-react";

import {
    updateProfile,
} from "../../services/api";


function ProfileForm({
    user,
    onProfileUpdated,
    onError,
}) {

    const [name, setName] =
    useState(user?.name || "");

const [email, setEmail] =
    useState(user?.email || "");

const [role, setRole] =
    useState(user?.targetRole || "");

const [education, setEducation] =
    useState(user?.education || "");

const [bio, setBio] =
    useState(user?.bio || "");

    const [saved, setSaved] =
        useState(false);

    const [saving, setSaving] =
        useState(false);


    // ========================================
    // SAVE
    // ========================================

    const handleSave =
        async (event) => {

            event.preventDefault();

            try {

                setSaving(true);

                setSaved(false);

                onError("");


                const data =
                    await updateProfile({
                        name,
                        email,
                        targetRole:
                            role,
                        education,
                        bio,
                    });


                onProfileUpdated(
                    data.user
                );


                setSaved(true);


                setTimeout(() => {

                    setSaved(false);

                }, 2500);

            } catch (error) {

                console.error(
                    "PROFILE UPDATE ERROR:",
                    error
                );

                onError(
                    error.message ||
                    "Failed to update profile."
                );

            } finally {

                setSaving(false);

            }
        };


    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900">
                    Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Update the information used for your AI
                    interview experience.
                </p>

            </div>


            <form
                onSubmit={
                    handleSave
                }
                className="space-y-5"
            >

                <div className="grid gap-5 sm:grid-cols-2">

                    <InputField
                        icon={User}
                        label="Full Name"
                        value={name}
                        onChange={
                            setName
                        }
                    />


                    <InputField
                        icon={Mail}
                        label="Email"
                        value={email}
                        onChange={
                            setEmail
                        }
                        type="email"
                    />

                </div>


                <InputField
                    icon={
                        BriefcaseBusiness
                    }
                    label="Target Role"
                    value={role}
                    onChange={
                        setRole
                    }
                />


                <InputField
                    icon={
                        GraduationCap
                    }
                    label="Education"
                    value={education}
                    onChange={
                        setEducation
                    }
                />


                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        About You
                    </label>


                    <textarea
                        value={bio}
                        onChange={(event) =>
                            setBio(
                                event.target.value
                            )
                        }
                        rows={4}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
                    />

                </div>


                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">

                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <Save size={16} />

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </button>


                    {saved && (

                        <span className="text-sm font-medium text-green-600">
                            Changes saved successfully.
                        </span>

                    )}

                </div>

            </form>

        </section>
    );
}


function InputField({
    icon: Icon,
    label,
    value,
    onChange,
    type = "text",
}) {

    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>


            <div className="relative">

                <Icon
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />


                <input
                    type={type}
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-900 focus:bg-white"
                />

            </div>

        </div>
    );
}


export default ProfileForm;