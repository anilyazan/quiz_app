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
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                const data = await response.json();
                const slicedData = data.slice(0, fetchedCount);
                const formattedQuestions = slicedData.map(question => ({
                    title: question.body,
                    options: [`A) ${question.body.split(" ")[0]}`, `B) ${question.body.split(" ")[1]}`, `C) ${question.body.split(" ")[2]}`, `D) ${question.body.split(" ")[3]}`],
                    correctAnswer: `C) ${question.body.split(" ")[2]}`
                }));
                setTotalQs(formattedQuestions.length);
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
                    setActive(true);
                }
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setActive(false);
            if (questions[currentIndex] !== undefined)
                setUserResponses([...userResponses, { question: questions[currentIndex].title, response: 'No Selection', correctAnswer: questions[currentIndex].correctAnswer }])
            handleNextQuestion();
        }
    }, [countdown]);

    const handleOptionClick = (selectedOption) => {
        const selectedAnswer = questions[currentIndex].options[selectedOption];
        setUserResponses([...userResponses, { question: questions[currentIndex].title, response: selectedAnswer, correctAnswer: questions[currentIndex].correctAnswer }]);
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
            return questions[currentIndex].options.map((option, index) => (
                <Button variant="outlined" key={index} onClick={() => handleOptionClick(index)} disabled={!isActive}>
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
            {displayResult ? (
                renderResult()
            ) : (
                <QuestionPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                <span style={{ fontWeight: 'bold' }}> {currentIndex + 1}:</span>  {questions[currentIndex]?.title}?
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
                    Question: {currentIndex + 1}/{totalQs}
                </Typography>
            </QuestionPaper>
            
            )}
        </div>
    );
}

export default Quiz;
