import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import InterviewHeader from "../components/interview/InterviewHeader";
import QuestionCard from "../components/interview/QuestionCard";
import AnswerBox from "../components/interview/AnswerBox";
import InterviewControls from "../components/interview/InterviewControls";

const questions = [
    "Can you explain how the event loop works in JavaScript?",
    "What is the difference between let, const and var in JavaScript?",
    "How does React's virtual DOM work?",
    "What is the difference between authentication and authorization?",
    "How would you design a REST API using Node.js and Express?",
    "What are MongoDB indexes and why are they useful?",
    "Explain the difference between SQL and NoSQL databases.",
    "How would you improve the performance of a React application?",
    "What happens when a user enters a URL in the browser?",
    "Tell me about a challenging project you have worked on.",
];

function LiveInterview() {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] =
        useState(1);

    const [answer, setAnswer] = useState("");

    const [listening, setListening] =
        useState(false);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [seconds, setSeconds] = useState(0);

    const totalQuestions = questions.length;

    /*
     * Timer
     */
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((previous) => previous + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    /*
     * Format timer
     */
    const formattedTime = formatTime(seconds);

    /*
     * Current question
     */
    const question =
        questions[currentQuestion - 1];

    /*
     * Simulated speech
     *
     * This is only UI for now.
     * Later we'll replace this with
     * browser SpeechSynthesis.
     */
    const handleSpeak = () => {
        setIsSpeaking(true);

        setTimeout(() => {
            setIsSpeaking(false);
        }, 2500);
    };

    /*
     * Simulated microphone
     *
     * Real Speech-to-Text will be
     * implemented later.
     */
    const handleToggleListening = () => {
        setListening((previous) => !previous);
    };

    /*
     * Submit answer
     */
    const handleSubmit = () => {
        if (!answer.trim()) return;

        if (currentQuestion === totalQuestions) {
            navigate("/interview/result");
            return;
        }

        setCurrentQuestion(
            (previous) => previous + 1
        );

        setAnswer("");

        setListening(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * Exit interview
     */
    const handleExit = () => {
        const confirmed = window.confirm(
            "Are you sure you want to exit the interview?"
        );

        if (confirmed) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <InterviewHeader
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                elapsedTime={formattedTime}
                onExit={handleExit}
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

                {/* Question */}
                <QuestionCard
                    question={question}
                    isSpeaking={isSpeaking}
                    onSpeak={handleSpeak}
                />

                {/* Answer */}
                <div className="mt-6">
                    <AnswerBox
                        answer={answer}
                        setAnswer={setAnswer}
                        listening={listening}
                        onToggleListening={
                            handleToggleListening
                        }
                    />
                </div>

                {/* Controls */}
                <div className="mt-6">
                    <InterviewControls
                        answer={answer}
                        onSubmit={handleSubmit}
                        isLastQuestion={
                            currentQuestion ===
                            totalQuestions
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

function formatTime(totalSeconds) {
    const minutes = Math.floor(
        totalSeconds / 60
    );

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;
}

export default LiveInterview;