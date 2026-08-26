import {
    CheckCircle2,
    AlertCircle,
    Lightbulb,
    BriefcaseBusiness,
} from "lucide-react";

import SkillList from "./SkillList";

function ResumeAnalysis() {
    return (
        <div className="space-y-6">
            {/* Strengths */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                        <CheckCircle2
                            size={20}
                            className="text-green-600"
                        />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Strengths
                        </h2>

                        <p className="text-sm text-slate-500">
                            What your resume does well
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-3">
                    <FeedbackItem>
                        Strong JavaScript and React experience
                    </FeedbackItem>

                    <FeedbackItem>
                        Good use of measurable project outcomes
                    </FeedbackItem>

                    <FeedbackItem>
                        Relevant MERN stack projects
                    </FeedbackItem>

                    <FeedbackItem>
                        Clear technical skill organization
                    </FeedbackItem>
                </div>
            </section>

            {/* Weaknesses */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                        <AlertCircle
                            size={20}
                            className="text-amber-600"
                        />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Areas to Improve
                        </h2>

                        <p className="text-sm text-slate-500">
                            Improvements that could strengthen your resume
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-3">
                    <FeedbackItem>
                        Add more quantified achievements
                    </FeedbackItem>

                    <FeedbackItem>
                        Improve the professional summary
                    </FeedbackItem>

                    <FeedbackItem>
                        Include more backend technologies
                    </FeedbackItem>
                </div>
            </section>

            {/* Skills */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <BriefcaseBusiness
                            size={20}
                            className="text-slate-700"
                        />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Skills Analysis
                        </h2>

                        <p className="text-sm text-slate-500">
                            Skills detected from your resume
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <SkillList
                        title="Detected Skills"
                        skills={[
                            "JavaScript",
                            "React",
                            "Node.js",
                            "Express",
                            "MongoDB",
                            "HTML",
                            "CSS",
                            "Git",
                            "REST API",
                        ]}
                    />

                    <SkillList
                        title="Recommended Skills"
                        type="missing"
                        skills={[
                            "TypeScript",
                            "Docker",
                            "AWS",
                            "Testing",
                        ]}
                    />
                </div>
            </section>

            {/* Recommendations */}
            <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <Lightbulb size={20} />
                    </div>

                    <div>
                        <h2 className="font-bold">
                            AI Recommendations
                        </h2>

                        <p className="text-sm text-slate-400">
                            How to improve your resume
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <Recommendation
                        number="01"
                        text="Rewrite your professional summary around the specific role you are targeting."
                    />

                    <Recommendation
                        number="02"
                        text="Add measurable results to your projects instead of only describing responsibilities."
                    />

                    <Recommendation
                        number="03"
                        text="Add TypeScript and testing experience if you are targeting modern frontend roles."
                    />
                </div>
            </section>
        </div>
    );
}

function FeedbackItem({ children }) {
    return (
        <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" />

            <p className="text-sm leading-6 text-slate-600">
                {children}
            </p>
        </div>
    );
}

function Recommendation({ number, text }) {
    return (
        <div className="flex gap-4">
            <span className="text-xs font-bold text-slate-500">
                {number}
            </span>

            <p className="text-sm leading-6 text-slate-300">
                {text}
            </p>
        </div>
    );
}

export default ResumeAnalysis;