import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import InterviewResult from "./pages/InterviewResult";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/resume"
                    element={<ResumeAnalyzer />}
                />

                <Route
                    path="/interview/setup"
                    element={<InterviewSetup />}
                />

                <Route
                    path="/interview/live/:interviewId"
                    element={<LiveInterview />}
                />

                <Route
                    path="/interview/result"
                    element={<InterviewResult />}
                />

                <Route
                    path="/history"
                    element={<InterviewHistory />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;