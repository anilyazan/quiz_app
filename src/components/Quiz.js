import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

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
    const period = 30;

    
    const [isEnabled, setEnabled] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(fetchedCount);
    const [questions, setQuestions] = useState([]);
    const [countdown, setCountdown] = useState(period);
    const [showResult, setShowResult] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponses, setUserResponses] = useState([]);
    
    

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
        setCountdown(period);
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Exam Result</Typography>
                <TableContainer sx={{ border: '1px solid #000', borderRadius: 5, overflow: 'hidden', marginTop: 2, maxWidth: 1000, margin: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Questions</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Your Answers</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Correct Answers</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userResponses.map((response, index) => (
                                <TableRow key={index} sx={{ backgroundColor: response.response === response.correctAnswer ? '#afed98' : '#f0bdbd' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                                    <TableCell>{response.question}</TableCell>
                                    <TableCell>{response.response}</TableCell>
                                    <TableCell>{response.correctAnswer}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AnswerPaper>
        );
    };

    return (
        <div>
            {showResult ? (
                renderResult()
            ) : (
                <QuestionPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                <span style={{ fontWeight: 'bold' }}> {currentQuestionIndex + 1}:</span>  {questions[currentQuestionIndex]?.title}?
                </Typography>
                <br>
                </br>
                 <br>
                </br>
                <div>{renderOptions()}</div>
                <br>
                </br> <br></br>
                <Typography variant="body1" gutterBottom style={{ color: 'red' }}>
                    Countdown: {countdown}
                </Typography>
                <Typography variant="body1" gutterBottom style={{ color: 'green' }}> 
                    Question: {currentQuestionIndex + 1}/{totalQuestions}
                </Typography>
            </QuestionPaper>
            
            )}
        </div>
    );
}

export default Quiz;
