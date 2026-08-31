import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import InterviewHeader from "../components/interview/InterviewHeader";
import QuestionCard from "../components/interview/QuestionCard";
import AnswerBox from "../components/interview/AnswerBox";
import InterviewControls from "../components/interview/InterviewControls";

import {
    getInterview,
    startInterview,
    submitAnswer,
} from "../services/api";


function LiveInterview() {

    const navigate = useNavigate();

    const { interviewId } =
        useParams();


    // ========================================
    // STATE
    // ========================================

    const [interview, setInterview] =
        useState(null);

    const [currentQuestion, setCurrentQuestion] =
        useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);

    const [answer, setAnswer] =
        useState("");

    const [listening, setListening] =
        useState(false);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [seconds, setSeconds] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD INTERVIEW
    // ========================================

    useEffect(() => {

        const loadInterview =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    // --------------------------------
                    // Get interview from backend
                    // --------------------------------

                    const data =
                        await getInterview(
                            interviewId
                        );

                    const backendInterview =
                        data.interview;


                    setInterview(
                        backendInterview
                    );


                    // --------------------------------
                    // Already completed?
                    // --------------------------------

                    if (
                        backendInterview.status ===
                        "completed"
                    ) {

                        navigate(
                            "/interview/result",
                            {
                                state: {
                                    interviewId,
                                },
                            }
                        );

                        return;
                    }


                    // --------------------------------
                    // Interview is already in progress
                    // --------------------------------

                    if (
                        backendInterview.status ===
                        "in-progress"
                    ) {

                        const index =
                            backendInterview.currentQuestionIndex;

                        const question =
                            backendInterview.questions[
                                index
                            ];


                        setCurrentQuestionIndex(
                            index
                        );

                        setCurrentQuestion(
                            question
                        );

                        setLoading(false);

                        return;
                    }


                    // --------------------------------
                    // Interview is newly created
                    // Start it
                    // --------------------------------

                    const started =
                        await startInterview(
                            interviewId
                        );

                    const startedInterview =
                        started.interview;


                    setInterview(
                        (previous) => ({
                            ...previous,
                            status:
                                startedInterview.status,

                            currentQuestionIndex:
                                startedInterview.currentQuestionIndex,
                        })
                    );


                    setCurrentQuestionIndex(
                        startedInterview.currentQuestionIndex
                    );


                    setCurrentQuestion(
                        startedInterview.currentQuestion
                    );


                } catch (error) {

                    console.error(
                        "LOAD INTERVIEW ERROR:",
                        error
                    );

                    setError(
                        error.message ||
                        "Failed to load interview."
                    );

                } finally {

                    setLoading(false);

                }
            };


        if (interviewId) {
            loadInterview();
        }

    }, [
        interviewId,
        navigate,
    ]);


    // ========================================
    // TIMER
    // ========================================

    useEffect(() => {

        if (loading || !interview) {
            return;
        }

        const timer =
            setInterval(() => {

                setSeconds(
                    (previous) =>
                        previous + 1
                );

            }, 1000);


        return () => {
            clearInterval(timer);
        };

    }, [
        loading,
        interview,
    ]);


    // ========================================
    // FORMAT TIMER
    // ========================================

    const formattedTime =
        formatTime(seconds);


    // ========================================
    // TOTAL QUESTIONS
    // ========================================

    const totalQuestions =
        interview?.totalQuestions ||
        0;


    // ========================================
    // SPEAK QUESTION
    // ========================================
    //
    // Still simulated for now.
    // Real SpeechSynthesis will be
    // implemented in the voice step.
    //

    const handleSpeak = () => {

        if (!currentQuestion) {
            return;
        }


        setIsSpeaking(true);


        setTimeout(() => {

            setIsSpeaking(false);

        }, 2500);
    };


    // ========================================
    // MICROPHONE
    // ========================================
    //
    // Still simulated for now.
    // Real Speech Recognition will
    // be implemented later.
    //

    const handleToggleListening = () => {

        setListening(
            (previous) =>
                !previous
        );
    };


    // ========================================
    // SUBMIT ANSWER
    // ========================================

    const handleSubmit =
        async () => {

            if (
                !answer.trim() ||
                submitting ||
                !currentQuestion
            ) {
                return;
            }


            try {

                setError("");

                setSubmitting(true);

                setListening(false);


                // --------------------------------
                // Send answer to backend
                // --------------------------------

                const data =
                    await submitAnswer(
                        interviewId,
                        answer.trim()
                    );


                console.log(
                    "ANSWER EVALUATION:",
                    data
                );


                // --------------------------------
                // Interview completed
                // --------------------------------

                if (
                    data.completed
                ) {

                    navigate(
                        "/interview/result",
                        {
                            state: {
                                interviewId,
                                result:
                                    data.result,
                            },
                        }
                    );

                    return;
                }


                // --------------------------------
                // Get next question
                // --------------------------------

                const nextQuestion =
                    data.nextQuestion;


                setCurrentQuestionIndex(
                    nextQuestion.index
                );


                setCurrentQuestion({
                    question:
                        nextQuestion.question,

                    category:
                        nextQuestion.category,

                    difficulty:
                        nextQuestion.difficulty,
                });


                // Clear answer

                setAnswer("");


                // Scroll to top

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });


            } catch (error) {

                console.error(
                    "SUBMIT ANSWER ERROR:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to evaluate answer."
                );

            } finally {

                setSubmitting(false);

            }
        };


    // ========================================
    // EXIT INTERVIEW
    // ========================================

    const handleExit = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to exit the interview?"
            );


        if (confirmed) {

            navigate(
                "/dashboard"
            );

        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                    <p className="mt-4 text-sm font-medium text-slate-700">
                        Preparing your interview...
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        The AI interviewer is getting your questions ready.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================
    // ERROR
    // ========================================

    if (
        error &&
        !interview
    ) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

                <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

                    <h2 className="text-xl font-bold text-slate-900">
                        Unable to load interview
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    // ========================================
    // UI
    // ========================================

    return (
        <div className="min-h-screen bg-slate-50">

            <InterviewHeader
                currentQuestion={
                    currentQuestionIndex + 1
                }

                totalQuestions={
                    totalQuestions
                }

                elapsedTime={
                    formattedTime
                }

                onExit={
                    handleExit
                }
            />


            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">

                {/* Mobile timer */}

                <div className="mb-5 flex items-center justify-center sm:hidden">

                    <div className="rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">

                        <span className="font-mono text-sm font-medium text-slate-600">
                            {formattedTime}
                        </span>

                    </div>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}


                {/* Question */}

                <QuestionCard
                    question={
                        currentQuestion?.question ||
                        ""
                    }

                    isSpeaking={
                        isSpeaking
                    }

                    onSpeak={
                        handleSpeak
                    }
                />


                {/* Answer */}

                <div className="mt-6">

                    <AnswerBox
                        answer={
                            answer
                        }

                        setAnswer={
                            setAnswer
                        }

                        listening={
                            listening
                        }

                        onToggleListening={
                            handleToggleListening
                        }
                    />

                </div>


                {/* Controls */}

                <div className="mt-6">

                    <InterviewControls
                        answer={
                            answer
                        }

                        onSubmit={
                            handleSubmit
                        }

                        isLastQuestion={
                            currentQuestionIndex ===
                            totalQuestions - 1
                        }
                    />

                </div>


                {/* Footer */}

                <div className="mt-8 text-center">

                    <p className="text-xs text-slate-400">

                        Take your time. The AI interviewer will
                        evaluate your answer after submission.

                    </p>

                </div>

            </main>

        </div>
    );
}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(
    totalSeconds
) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;


    return `${String(
        minutes
    ).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;
}


export default LiveInterview;