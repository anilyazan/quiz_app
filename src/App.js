import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import "./styles/tailwind.css"
const App = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <Router>
      <div className="bg-red-500 text-white p-4">Merhaba, Tailwind CSS!</div>


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
