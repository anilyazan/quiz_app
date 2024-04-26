import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";

const QuestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
  margin: 15,
}));

const AnswerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "start",
  margin: 15,
}));

function Quiz() {
  const fetchedCount = 10;
  const period = 30;
  const isMobile = useMediaQuery("(max-width:600px)");

  const [isActive, setActive] = useState(false);
  const [totalQs, setTotalQs] = useState(fetchedCount);
  const [questions, setQuestions] = useState([]);
  const [countdown, setCountdown] = useState(period);
  const [displayResult, setDisplayResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        const slicedData = data.slice(0, fetchedCount);
        const correctAnswers = ["A", "B", "C", "D"];
        const formattedQuestions = slicedData.map((question, index) => ({
          title: question.body,
          options: [
            `A) ${question.body.split(" ")[0]}`,
            `B) ${question.body.split(" ")[1]}`,
            `C) ${question.body.split(" ")[2]}`,
            `D) ${question.body.split(" ")[3]}`,
          ],
          correctAnswer: `${correctAnswers[index % 4]}) ${
            question.body.split(" ")[index % 4]
          }`,
        }));

        setTotalQs(formattedQuestions.length);
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown - 1 <= 20) {
          setActive(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setActive(false);
      if (questions[currentIndex] !== undefined)
        setUserResponses([
          ...userResponses,
          {
            question: questions[currentIndex].title,
            response: "No Selection",
            correctAnswer: questions[currentIndex].correctAnswer,
          },
        ]);
      handleNextQuestion();
    }
  }, [countdown]);

  const handleOptionClick = (selectedOption) => {
    const selectedAnswer = questions[currentIndex].options[selectedOption];
    setUserResponses([
      ...userResponses,
      {
        question: questions[currentIndex].title,
        response: selectedAnswer,
        correctAnswer: questions[currentIndex].correctAnswer,
      },
    ]);
    setActive(false);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setCountdown(period);
    if (currentIndex + 1 === questions.length) {
      setDisplayResult(true);
    }
  };

  const renderOptions = () => {
    if (currentIndex < questions.length) {
      const buttonWidth = isMobile ? "100%" : "20%";
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {questions[currentIndex].options.map((option, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleOptionClick(index)}
              disabled={!isActive}
              style={{
                marginBottom: 10,
                width: buttonWidth,
                display: "flex",
                justifyContent: "flex-start",
                textAlign: "left",
                textTransform: "capitalize",
                paddingLeft: 10,
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }
  };

  const renderResult = () => {
    return (
      <AnswerPaper elevation={3}>
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
          Exam Result
        </Typography>
        <div style={{ overflowX: "auto" }}>
          <TableContainer
            sx={{
              border: "1px solid #000",
              borderRadius: 5,
              overflowY: "auto",
              marginTop: 2,
              maxWidth: 1000,
              margin: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Questions</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Your Answers
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Correct Answers
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userResponses.map((response, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        response.response === response.correctAnswer
                          ? "#afed98"
                          : "#f0bdbd",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>{response.question}</TableCell>
                    <TableCell>{response.response}</TableCell>
                    <TableCell>{response.correctAnswer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </AnswerPaper>
    );
  };

  return (
    <div>
      {displayResult ? (
        renderResult()
      ) : (
        <QuestionPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            <span style={{ fontWeight: "bold" }}> {currentIndex + 1}:</span>{" "}
            {questions[currentIndex]?.title.charAt(0).toUpperCase() +
              questions[currentIndex]?.title.slice(1)}
            ?
          </Typography>
          <br />
          <br />
          <div>{renderOptions()}</div>
          <br /> <br />
          <Typography variant="body1" gutterBottom style={{ color: "red" }}>
            Time: {countdown}
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: "green" }}>
            Question: {currentIndex + 1}/{totalQs}
          </Typography>
        </QuestionPaper>
      )}
    </div>
  );
}

export default Quiz;
