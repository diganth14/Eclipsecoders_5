'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating practice quizzes based on weak topics.
 *
 * - generateWeakTopicQuiz - A function that generates a practice quiz based on a specified weak topic.
 * - WeakTopicQuizInput - The input type for the generateWeakTopicQuiz function.
 * - WeakTopicQuizOutput - The return type for the generateWeakTopicQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeakTopicQuizInputSchema = z.object({
  topic: z
    .string()
    .describe('The specific topic for which the quiz should be generated.'),
  gradeLevel: z
    .string()
    .describe('The grade level of the student taking the quiz.'),
  examType: z
    .string()
    .describe('The type of exam the quiz is preparing for (e.g., school, competitive).'),
  numberOfQuestions: z
    .number()
    .int()
    .positive()
    .default(5)
    .describe('The number of questions to include in the quiz.'),
});
export type WeakTopicQuizInput = z.infer<typeof WeakTopicQuizInputSchema>;

const WeakTopicQuizOutputSchema = z.object({
  quizTitle: z.string().describe('The title of the generated quiz.'),
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the quiz question.'),
      options: z.array(z.string()).describe('The possible answer options for the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The array of quiz questions, each with its question, options, and correct answer.'),
});
export type WeakTopicQuizOutput = z.infer<typeof WeakTopicQuizOutputSchema>;

export async function generateWeakTopicQuiz(input: WeakTopicQuizInput): Promise<WeakTopicQuizOutput> {
  return weakTopicQuizFlow(input);
}

const quizPrompt = ai.definePrompt({
  name: 'weakTopicQuizPrompt',
  input: {schema: WeakTopicQuizInputSchema},
  output: {schema: WeakTopicQuizOutputSchema},
  prompt: `You are an expert quiz generator, skilled at creating practice quizzes for students.

  Based on the student's grade level ({{{gradeLevel}}}), the type of exam they are preparing for ({{{examType}}}),
  and their identified weak topic ({{{topic}}}), generate a quiz with {{{numberOfQuestions}}} questions.

  Each question should have multiple choice options, and you should clearly indicate the correct answer.
  The quiz should be formatted as a JSON object with a "quizTitle" and a "questions" array.
  Each question in the "questions" array should have a "question", an "options" array, and a "correctAnswer".

  Make sure that each question is relevant to the specified topic and appropriate for the student's grade level.
  The options should be plausible but only one should be correct. Avoid trick questions or ambiguous wording.

  Here's an example of the desired JSON output format:
  {
    "quizTitle": "Quiz Title",
    "questions": [
      {
        "question": "Question 1",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A"
      },
      {
        "question": "Question 2",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option C"
      }
    ]
  }
  \nMake sure that the quiz is in JSON format.
  \nNow generate the quiz. Be sure to vary the quiz title.
  `,
});

const weakTopicQuizFlow = ai.defineFlow(
  {
    name: 'weakTopicQuizFlow',
    inputSchema: WeakTopicQuizInputSchema,
    outputSchema: WeakTopicQuizOutputSchema,
  },
  async input => {
    const {output} = await quizPrompt(input);
    return output!;
  }
);
