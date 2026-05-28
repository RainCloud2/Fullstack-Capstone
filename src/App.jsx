import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import RoadmapPage from "./pages/RoadmapPage";
import QuizPage from "./pages/QuizPage";
import CoursePage from "./pages/CoursePage";
import LearningPage from "./pages/LearningPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import QuizResultPage from "./pages/QuizResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/learning/:phaseId" element={<LearningPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:phaseId" element={<QuizDetailPage />} />
        <Route path="/quiz-result/:resultId" element={<QuizResultPage />} />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
