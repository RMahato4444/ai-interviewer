const SETTINGS_KEY = "appSettings";
const READ_KEY = "interviewAINotificationRead";

const DEFAULT_NOTIFICATION_PREFERENCES = {
    interviewReminders: false,
    performanceUpdates: true,
};

export function getNotificationPreferences() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        if (!saved) {
            return DEFAULT_NOTIFICATION_PREFERENCES;
        }

        const settings = JSON.parse(saved);

        return {
            ...DEFAULT_NOTIFICATION_PREFERENCES,
            interviewReminders: settings.interviewReminders === true,
            performanceUpdates: settings.performanceUpdates !== false,
        };
    } catch {
        return DEFAULT_NOTIFICATION_PREFERENCES;
    }
}

export function getReadNotificationIds() {
    try {
        const saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]");

        return Array.isArray(saved)
            ? saved.filter((id) => typeof id === "string")
            : [];
    } catch {
        return [];
    }
}

function saveReadNotificationIds(ids) {
    const uniqueIds = [...new Set(ids)].slice(-250);

    localStorage.setItem(READ_KEY, JSON.stringify(uniqueIds));

    return uniqueIds;
}

export function markNotificationRead(notificationId) {
    return saveReadNotificationIds([
        ...getReadNotificationIds(),
        notificationId,
    ]);
}

export function markAllNotificationsRead(notificationIds = []) {
    return saveReadNotificationIds([
        ...getReadNotificationIds(),
        ...notificationIds,
    ]);
}

function getTimestamp(value) {
    if (!value) return 0;

    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function buildNotifications(
    interviews = [],
    resumes = [],
    preferences = getNotificationPreferences()
) {
    const items = [];

    if (preferences.performanceUpdates) {
        const completedInterviews = interviews
            .filter((interview) => interview.status === "completed")
            .sort(
                (a, b) =>
                    getTimestamp(b.completedAt || b.createdAt) -
                    getTimestamp(a.completedAt || a.createdAt)
            )
            .slice(0, 5);

        completedInterviews.forEach((interview) => {
            if (!interview._id) return;

            const score =
                typeof interview.overallScore === "number"
                    ? interview.overallScore + "%"
                    : "ready";

            items.push({
                id: "interview-" + interview._id,
                icon: "interview",
                title: "Interview result ready",
                message:
                    (interview.targetRole || "Your interview") +
                    " · " +
                    score +
                    ". View your feedback.",
                createdAt: interview.completedAt || interview.createdAt,
                to: "/interview/result/" + interview._id,
            });
        });

        const analyzedResumes = resumes
            .filter(
                (resume) =>
                    typeof resume.aiAnalysis?.overallScore === "number"
            )
            .sort(
                (a, b) =>
                    getTimestamp(b.updatedAt || b.createdAt) -
                    getTimestamp(a.updatedAt || a.createdAt)
            )
            .slice(0, 5);

        analyzedResumes.forEach((resume) => {
            if (!resume._id) return;

            const updatedAt = resume.updatedAt || resume.createdAt;

            items.push({
                id:
                    "resume-" +
                    resume._id +
                    "-" +
                    getTimestamp(updatedAt),
                icon: "resume",
                title: "Resume analysis ready",
                message:
                    (resume.originalName || "Your resume") +
                    " · " +
                    resume.aiAnalysis.overallScore +
                    "% score. View your analysis.",
                createdAt: updatedAt,
                to: "/resume",
                state: { resumeId: resume._id },
            });
        });
    }

    // Reminders appear in the in-app bell while the app is open.
    if (preferences.interviewReminders) {
        const latestInterviewActivity = interviews
            .map((interview) =>
                getTimestamp(
                    interview.completedAt ||
                    interview.updatedAt ||
                    interview.createdAt
                )
            )
            .filter((timestamp) => timestamp > 0)
            .sort((a, b) => b - a)[0];

        const now = Date.now();

        const daysSinceActivity = latestInterviewActivity
            ? Math.floor((now - latestInterviewActivity) / (24 * 60 * 60 * 1000))
            : null;

        if (daysSinceActivity === null || daysSinceActivity >= 7) {
            const today = new Date().toISOString().slice(0, 10);

            items.push({
                id: "practice-reminder-" + today,
                icon: "reminder",
                title: latestInterviewActivity
                    ? "Time for another practice session"
                    : "Start your first AI interview",
                message: latestInterviewActivity
                    ? "It has been " +
                        daysSinceActivity +
                        " days since your latest interview activity. Keep your practice consistent."
                    : "Start an AI interview to build your confidence and track your progress.",
                createdAt: new Date(now).toISOString(),
                to: "/interview/setup",
            });
        }
    }

    return items.sort(
        (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
    );
}
