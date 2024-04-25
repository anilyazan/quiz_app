import React, { useState, useEffect } from 'react';
import {Button, Paper} from '@mui/material';
import { styled } from '@mui/material/styles';

const QuestionPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    margin: 15,
}));

const AnswerPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'start',
    margin: 15,
}));

function Quiz() {
    const fetchedCount = 10;
    const duration = 30;

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isEnabled, setEnabled] = useState(false);
    const [countdown, setCountdown] = useState(duration);
    const [totalQuestions, setTotalQuestions] = useState(fetchedCount);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                const data = await response.json();
                const slicedData = data.slice(0, fetchedCount);
                const formattedQuestions = slicedData.map(question => ({
                    title: question.body,
                    options: [`A) ${question.body.split(" ")[0]}`, `B) ${question.body.split(" ")[1]}`, `C) ${question.body.split(" ")[2]}`, `D) ${question.body.split(" ")[3]}`],
                    correctAnswer: `C) ${question.body.split(" ")[2]}`
                }));
                setTotalQuestions(formattedQuestions.length);
                setQuestions(formattedQuestions);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
                if ((countdown - 1) <= 20) {
                    setEnabled(true);
                }
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setEnabled(false);
            if (questions[currentQuestionIndex] !== undefined)
                setUserResponses([...userResponses, { question: questions[currentQuestionIndex].title, response: 'No Selection', correctAnswer: questions[currentQuestionIndex].correctAnswer }])
            handleNextQuestion();
        }
    }, [countdown]);

    const handleOptionClick = (selectedOption) => {
        const selectedAnswer = questions[currentQuestionIndex].options[selectedOption];
        setUserResponses([...userResponses, { question: questions[currentQuestionIndex].title, response: selectedAnswer, correctAnswer: questions[currentQuestionIndex].correctAnswer }]);
        setEnabled(false);
        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCountdown(duration);
        if (currentQuestionIndex + 1 === questions.length) {
            setShowResult(true);
        }
    };

    const renderOptions = () => {
        if (currentQuestionIndex < questions.length) {
            return questions[currentQuestionIndex].options.map((option, index) => (
                <Button variant="outlined" key={index} onClick={() => handleOptionClick(index)} disabled={!isEnabled}>
                    {option}
                </Button>
            ));
        }
    };

    const renderResult = () => {
        return (
            <AnswerPaper  elevation={3}>
                <h2>Result</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Questions</th>
                            <th>Your Answers</th>
                            <th>Correct Answers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userResponses.map((response, index) => (
                            <tr key={index}>
                                <td>{index +1 } </td>
                                <td>{response.question}</td>
                                <td>{response.response}</td>
                                <td>{response.correctAnswer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AnswerPaper>
        );
    };

    return (
        <div>
            {showResult ? (
                renderResult()
            ) : (
                <QuestionPaper  elevation={3}>
                    <a>{questions[currentQuestionIndex]?.title}?</a>
                    <div>Countdown: {countdown}</div>
                    <div>Question: {currentQuestionIndex + 1}/{totalQuestions}</div>
                    <div>{renderOptions()}</div>
                </QuestionPaper>
            )}
        </div>
    );
}

export default Quiz;
