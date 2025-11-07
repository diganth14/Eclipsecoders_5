'use server';

import {
  generatePersonalizedStudyPlan,
  PersonalizedStudyPlanInput,
} from '@/ai/flows/personalized-study-plan';
import {
  generateWeakTopicQuiz,
  WeakTopicQuizInput,
} from '@/ai/flows/weak-topic-quiz-generator';

export async function getStudyPlan(input: PersonalizedStudyPlanInput) {
  try {
    const result = await generatePersonalizedStudyPlan(input);
    return { success: true, plan: result.studyPlan };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate study plan.' };
  }
}

export async function getQuiz(input: WeakTopicQuizInput) {
  try {
    const result = await generateWeakTopicQuiz(input);
    return { success: true, quiz: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate quiz.' };
  }
}
