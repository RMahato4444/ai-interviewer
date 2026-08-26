import { Link } from "react-router-dom";

function Register() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
                <h1 className="text-3xl font-bold text-white">
                    Create account
                </h1>

                <p className="mt-2 text-slate-400">
                    Start preparing for your next interview.
                </p>

                <form className="mt-8 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Full name
                        </label>

                        <input
                            type="text"
                            placeholder="Rahul Mahato"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-xl bg-white py-3 font-semibold text-slate-950 hover:bg-slate-200"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-white hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;