'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { WeakTopicQuizOutput } from '@/ai/flows/weak-topic-quiz-generator';

interface QuizViewProps {
  quiz: WeakTopicQuizOutput;
  onFinish: () => void;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function QuizView({ quiz, onFinish }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    setCurrentQuestionIndex(0); // Reset to first question to show results
  };

  const getAnswerState = (option: string, questionIndex: number): AnswerState => {
    if (!isSubmitted) return 'unanswered';
    const question = quiz.questions[questionIndex];
    const isCorrect = option === question.correctAnswer;
    const isSelected = selectedAnswers[questionIndex] === option;
    
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return 'unanswered';
  };

  if (isSubmitted) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Quiz Results</DialogTitle>
        </DialogHeader>
        <div className="my-4 text-center">
            <p className="text-xl">You scored</p>
            <p className="font-headline text-6xl font-bold text-primary">
                {score} / {quiz.questions.length}
            </p>
        </div>
        <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2">
            {quiz.questions.map((q, index) => {
                return (
                    <Card key={index} className="p-4">
                        <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                        <div className="space-y-2">
                        {q.options.map((option) => {
                            const state = getAnswerState(option, index);
                            return (
                                <div key={option} className={`flex items-center gap-2 text-sm p-2 rounded-md ${
                                    state === 'correct' ? 'bg-green-100 dark:bg-green-900/50' : ''
                                } ${
                                    state === 'incorrect' ? 'bg-red-100 dark:bg-red-900/50' : ''
                                }`}>
                                    {state === 'correct' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                    {state === 'incorrect' && <XCircle className="h-4 w-4 text-red-600" />}
                                    <p>{option}</p>
                                </div>
                            )
                        })}
                        </div>
                    </Card>
                )
            })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onFinish} className="w-full">
              Finish Review
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{quiz.quizTitle}</DialogTitle>
      </DialogHeader>
      
      <div className="my-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-base">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="gap-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button
          onClick={handleNext}
          className="w-full"
          disabled={!selectedAnswers[currentQuestionIndex]}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
        </Button>
      </DialogFooter>
    </>
  );
}
