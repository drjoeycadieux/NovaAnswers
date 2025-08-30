// Implemented Genkit flow for displaying attributions for each answer by referring to supporting information.

'use server';
/**
 * @fileOverview AI agent for displaying attributions for each answer by referring to supporting information.
 *
 * - displaySourceAttributions - A function that handles the source attribution process.
 * - DisplaySourceAttributionsInput - The input type for the displaySourceAttributions function.
 * - DisplaySourceAttributionsOutput - The return type for the displaySourceAttributions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplaySourceAttributionsInputSchema = z.object({
  question: z.string().describe('The question asked by the user.'),
  answer: z.string().describe('The generated answer from the AI.'),
});
export type DisplaySourceAttributionsInput = z.infer<typeof DisplaySourceAttributionsInputSchema>;

const DisplaySourceAttributionsOutputSchema = z.object({
  attributedAnswer: z.string().describe('The answer with source attributions.'),
  sources: z.array(z.string()).describe('The sources used to generate the answer.'),
});
export type DisplaySourceAttributionsOutput = z.infer<typeof DisplaySourceAttributionsOutputSchema>;

export async function displaySourceAttributions(input: DisplaySourceAttributionsInput): Promise<DisplaySourceAttributionsOutput> {
  return displaySourceAttributionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displaySourceAttributionsPrompt',
  input: {schema: DisplaySourceAttributionsInputSchema},
  output: {schema: DisplaySourceAttributionsOutputSchema},
  prompt: `Given the following question and answer, provide attributions for each statement in the answer by referring to supporting information. Return the answer with inline citations and a list of sources used. 

Question: {{{question}}}
Answer: {{{answer}}}

Attributed Answer:`,
});

const displaySourceAttributionsFlow = ai.defineFlow(
  {
    name: 'displaySourceAttributionsFlow',
    inputSchema: DisplaySourceAttributionsInputSchema,
    outputSchema: DisplaySourceAttributionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
