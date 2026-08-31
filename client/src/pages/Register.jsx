import { useState } from "react";

import {
    ArrowLeft,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";


function Register() {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");


            // Validation

            if (!name.trim()) {

                setError(
                    "Please enter your full name."
                );

                return;
            }


            if (!email.trim()) {

                setError(
                    "Please enter your email."
                );

                return;
            }


            if (!password) {

                setError(
                    "Please enter a password."
                );

                return;
            }


            if (
                password.length <
                6
            ) {

                setError(
                    "Password must be at least 6 characters."
                );

                return;
            }


            try {

                setLoading(true);


                const response =
                    await fetch(
                        "http://localhost:5000/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify({
                                    name:
                                        name.trim(),

                                    email:
                                        email.trim(),

                                    password,
                                }),
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "REGISTER RESPONSE:",
                    data
                );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


                // JWT

                const token =
                    data.token ||
                    data.accessToken ||
                    data.data?.token ||
                    data.data?.accessToken;


                if (!token) {

                    throw new Error(
                        "Registration succeeded, but no authentication token was returned."
                    );

                }


                localStorage.setItem(
                    "token",
                    token
                );


                // User

                const user =
                    data.user ||
                    data.data?.user;


                if (user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            user
                        )
                    );

                }


                // Dashboard

                navigate(
                    "/dashboard"
                );


            } catch (error) {

                console.error(
                    "REGISTER ERROR:",
                    error
                );


                setError(
                    error.message ||
                    "Something went wrong during registration."
                );


            } finally {

                setLoading(false);

            }
        };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

                {/* Back */}

                <Link
                    to="/"
                    className="auth-back-button inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>


                <h1 className="mt-6 text-3xl font-bold text-white">
                    Create account
                </h1>


                <p className="mt-2 text-slate-400">
                    Start preparing for your next interview.
                </p>


                {/* ERROR */}

                {error && (

                    <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-8 space-y-5"
                >

                    {/* NAME */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Full name
                        </label>


                        <input
                            type="text"
                            placeholder="Rahul Mahato"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                        />

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Email
                        </label>


                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
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
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400"
                        />

                    </div>


                    {/* CREATE ACCOUNT */}

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="auth-blue-button w-full rounded-xl py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        Sign in
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;