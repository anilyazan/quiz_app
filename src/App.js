import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./components/Quiz";
import "./styles/tailwind.css";
const App = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <Router>
      <div
        style={{
          backgroundColor: "#8b93f0",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        {!showQuiz && (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              Welcome to the test. Press the start button to begin.
            </h1>
            <button
              style={{
                backgroundColor: "#afed98",
                color: "black",
                padding: "20px 40px",
                borderRadius: "5px",
                marginTop: "20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={handleStartQuiz}
            >
              Start
            </button>
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
