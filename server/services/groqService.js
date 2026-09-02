const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "openai/gpt-oss-120b";

// ========================================
// ANALYZE RESUME
// ========================================

const analyzeResume = async (resumeText) => {
    const prompt = `
You are an expert resume reviewer and technical recruiter.

Analyze the following resume carefully.

Return ONLY valid JSON.
Do not use markdown.
Do not put the JSON inside a code block.

The JSON must follow exactly this structure:

{
    "overallScore": 0,
    "summary": "",
    "skills": [],
    "technicalSkills": [],
    "softSkills": [],
    "strengths": [],
    "weaknesses": [],
    "missingSkills": [],
    "suggestedRoles": [],
    "experienceSummary": "",
    "educationSummary": "",
    "projects": [],
    "atsFeedback": [],
    "improvementSuggestions": []
}

Rules:

1. overallScore must be a number between 0 and 100.
2. skills must contain important skills found in the resume.
3. technicalSkills must contain programming languages,
   frameworks, databases, tools and technologies.
4. softSkills should contain soft skills that are reasonably
   supported by the resume.
5. strengths should contain specific strengths.
6. weaknesses should contain realistic weaknesses or gaps.
7. missingSkills should contain skills that would improve
   the candidate's employability based on their existing profile.
8. suggestedRoles should contain suitable job roles.
9. experienceSummary should summarize the candidate's experience.
10. educationSummary should summarize their education.
11. projects should contain important projects mentioned
    in the resume.
12. atsFeedback should contain actionable ATS-related feedback.
13. improvementSuggestions should contain practical improvements.
14. Do not invent companies, degrees, jobs, certifications,
    projects or skills that are not supported by the resume.

Resume:

${resumeText}
`;

    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
        throw new Error("Groq returned an empty response");
    }

    return text;
};

// ========================================
// GENERATE INTERVIEW QUESTIONS
// ========================================

const generateInterviewQuestions = async ({
    targetRole,
    interviewType,
    difficulty,
    totalQuestions,
    resumeAnalysis,
}) => {
    const prompt = `
You are an expert technical interviewer.

Create an interview for a candidate applying for:

Target Role:
${targetRole}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Number of Questions:
${totalQuestions}

Here is the candidate's resume analysis:

${JSON.stringify(resumeAnalysis, null, 2)}

Generate exactly ${totalQuestions} interview questions.

The questions should be relevant to the target role
and personalized according to the candidate's skills.

Follow these rules:

1. Return ONLY valid JSON.
2. Do not use markdown.
3. Do not put JSON inside a code block.
4. Generate exactly ${totalQuestions} questions.
5. Questions should progressively test the candidate.
6. Include technical questions for technical interviews.
7. Include behavioral questions for HR interviews.
8. For Mixed interviews, combine technical and behavioral questions.
9. Use the candidate's actual skills when possible.
10. Do not ask questions about skills that are completely unrelated
    to the candidate's profile.
11. Do not include answers.
12. Do not include explanations.

Return exactly this structure:

{
    "questions": [
        {
            "question": "",
            "category": "",
            "difficulty": ""
        }
    ]
}

Allowed category values:

Technical
Behavioral
Problem Solving
Project
HR

Allowed difficulty values:

Easy
Medium
Hard
`;

    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
        throw new Error("Groq returned an empty response");
    }

    return text;
};

// ========================================
// EVALUATE INTERVIEW ANSWER
// ========================================

const evaluateInterviewAnswer = async ({
    question,
    answer,
    targetRole,
    difficulty,
}) => {
    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer to the interview question.

Target Role:
${targetRole}

Difficulty:
${difficulty}

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer based on:

1. Correctness
2. Relevance
3. Technical understanding
4. Clarity
5. Completeness

Return ONLY valid JSON.
Do not use markdown.
Do not put the JSON inside a code block.

Return exactly this structure:

{
    "score": 0,
    "feedback": "",
    "strengths": [],
    "improvements": []
}

Rules:

1. score must be between 0 and 100.
2. feedback should clearly explain the quality of the answer.
3. strengths should contain specific positive points.
4. improvements should contain specific ways the candidate can improve.
5. Do not invent information.
6. Judge the answer according to the question.
7. A partially correct answer should receive a partial score.
8. An empty or irrelevant answer should receive a low score.
`;

    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
        throw new Error("Groq returned an empty response");
    }

    return text;
};

// ========================================
// GENERATE FINAL INTERVIEW FEEDBACK
// ========================================

const generateFinalInterviewFeedback = async ({
    targetRole,
    interviewType,
    difficulty,
    questions,
    overallScore,
}) => {
    const prompt = `
You are an expert interview coach.

Analyze the completed interview of a candidate.

Target Role:
${targetRole}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Overall Score:
${overallScore}

Interview Questions and Evaluations:

${JSON.stringify(questions, null, 2)}

Provide a concise but useful final interview assessment.

Return ONLY valid JSON.

Do not use markdown.
Do not put JSON inside a code block.

Return exactly this structure:

{
    "overallFeedback": "",
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
}

Rules:

1. overallFeedback should summarize the candidate's performance.
2. strengths should contain the candidate's strongest areas.
3. weaknesses should contain areas that need improvement.
4. recommendations should give practical steps for improvement.
5. Base everything on the questions and evaluations provided.
6. Do not invent skills or experience.
7. Keep the feedback professional and useful.
`;

    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
        throw new Error("Groq returned an empty response");
    }

    return text;
};

module.exports = {
    analyzeResume,
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    generateFinalInterviewFeedback,
};