const API_URL = "http://localhost:5000/api";


// ========================================
// GET TOKEN
// ========================================

const getToken = () => {
    return localStorage.getItem("token");
};


// ========================================
// GENERIC API REQUEST
// ========================================

const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );
    }

    return data;
};


// ========================================
// SERVER HEALTH
// ========================================

export const checkServer =
    async () => {

        const response =
            await fetch(
                `${API_URL}/health`
            );

        if (!response.ok) {
            throw new Error(
                "Server request failed"
            );
        }

        return response.json();
    };


// ========================================
// CREATE INTERVIEW
// ========================================

export const createInterview =
    async (interviewData) => {

        return apiRequest(
            "/interview",
            {
                method: "POST",

                body:
                    JSON.stringify(
                        interviewData
                    ),
            }
        );
    };


// ========================================
// START INTERVIEW
// ========================================

export const startInterview =
    async (interviewId) => {

        return apiRequest(
            `/interview/${interviewId}/start`,
            {
                method: "POST",
            }
        );
    };


// ========================================
// GET SINGLE INTERVIEW
// ========================================

export const getInterview =
    async (interviewId) => {

        return apiRequest(
            `/interview/${interviewId}`
        );
    };


// ========================================
// SUBMIT ANSWER
// ========================================

export const submitAnswer =
    async (
        interviewId,
        answer
    ) => {

        return apiRequest(
            `/interview/${interviewId}/answer`,
            {
                method: "POST",

                body:
                    JSON.stringify({
                        answer,
                    }),
            }
        );
    };


// ========================================
// GET INTERVIEW RESULT
// ========================================

export const getInterviewResult =
    async (interviewId) => {

        return apiRequest(
            `/interview/${interviewId}/result`
        );
    };


// ========================================
// GET INTERVIEW HISTORY
// ========================================

export const getInterviews =
    async () => {

        return apiRequest(
            "/interview"
        );
    };


// ========================================
// DELETE INTERVIEW
// ========================================

export const deleteInterview =
    async (interviewId) => {

        return apiRequest(
            `/interview/${interviewId}`,
            {
                method: "DELETE",
            }
        );
    };