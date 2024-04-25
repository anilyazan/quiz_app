import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import "tailwindcss/tailwind.css";

const App = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <Router>
      <div>
        {!showQuiz && (
          <div>
            <h1>Welcome to the test. Press the start button to begin.</h1>
            <button onClick={handleStartQuiz}>Start</button>
          </div>
        )}
        {showQuiz && (
          <Routes>
            <Route path="/" element={<Quiz />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
