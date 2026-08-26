import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Login failed."
                );
            }

            /*
             * Store JWT token
             */
            const token =
                data.token ||
                data.accessToken ||
                data.data?.token ||
                data.data?.accessToken;

            if (!token) {

                throw new Error(
                    "Login successful, but no authentication token was returned."
                );
            }

            localStorage.setItem(
                "token",
                token
            );

            /*
             * Store user information
             */
            const user =
                data.user ||
                data.data?.user;

            if (user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            console.log(
                "Token saved successfully."
            );

            /*
             * Go to dashboard
             */
            navigate("/dashboard");

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            setError(
                error.message ||
                "Something went wrong while logging in."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

                <h1 className="text-3xl font-bold text-white">
                    Welcome back
                </h1>

                <p className="mt-2 text-slate-400">
                    Sign in to continue your interview preparation.
                </p>


                {/* ERROR MESSAGE */}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"

                            value={email}

                            onChange={(e) =>
                                setEmail(e.target.value)
                            }

                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"

                            value={password}

                            onChange={(e) =>
                                setPassword(e.target.value)
                            }

                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"

                        disabled={loading}

                        className="w-full rounded-xl bg-white py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-white hover:underline"
                    >
                        Create one
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;