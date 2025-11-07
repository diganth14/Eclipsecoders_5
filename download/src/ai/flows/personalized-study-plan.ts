'use server';

/**
 * @fileOverview A personalized study plan generator AI agent.
 *
 * - generatePersonalizedStudyPlan - A function that generates a personalized study plan.
 * - PersonalizedStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - PersonalizedStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStudyPlanInputSchema = z.object({
  grade: z.string().describe('The grade of the student.'),
  targetExam: z.string().describe('The target exam for which the study plan is being generated.'),
  weakAreas: z.array(z.string()).describe('An array of topics or subjects in which the student is weak.'),
});
export type PersonalizedStudyPlanInput = z.infer<typeof PersonalizedStudyPlanInputSchema>;

const PersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A personalized study plan for the student.'),
});
export type PersonalizedStudyPlanOutput = z.infer<typeof PersonalizedStudyPlanOutputSchema>;

export async function generatePersonalizedStudyPlan(
  input: PersonalizedStudyPlanInput
): Promise<PersonalizedStudyPlanOutput> {
  return personalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStudyPlanPrompt',
  input: {schema: PersonalizedStudyPlanInputSchema},
  output: {schema: PersonalizedStudyPlanOutputSchema},
  prompt: `You are an expert tutor. Generate a personalized study plan for a student in grade {{grade}} who is preparing for the {{targetExam}} exam. The student is weak in the following areas: {{#each weakAreas}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.  The study plan should be detailed and actionable, providing specific steps and resources for the student to improve in their weak areas. Also ensure that all the resources provided are freely available on the internet.
`,
});

const personalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'personalizedStudyPlanFlow',
    inputSchema: PersonalizedStudyPlanInputSchema,
    outputSchema: PersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
