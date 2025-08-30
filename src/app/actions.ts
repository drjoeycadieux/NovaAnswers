'use server';

import { generateAnswer } from '@/ai/flows/generate-answer';
import { displaySourceAttributions } from '@/ai/flows/display-source-attributions';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AskQuestionSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters long.' }),
});

export interface FormState {
  attributedAnswer?: string;
  sources?: string[];
  question?: string;
  error?: string;
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function askQuestionAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = AskQuestionSchema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.question?.join(', '),
    };
  }
  
  const { question } = validatedFields.data;

  try {
    const answerResult = await generateAnswer({ question });
    
    if (!answerResult || !answerResult.answer) {
      return { question, error: 'Could not generate an answer. Please try again.' };
    }

    // Pass the generated answer to the attribution flow
    const attributionResult = await displaySourceAttributions({
      question: question,
      answer: answerResult.answer,
    });
    
    // If attribution fails, fallback to the non-attributed answer
    if (!attributionResult || !attributionResult.attributedAnswer) {
      return { 
        question, 
        attributedAnswer: answerResult.answer, 
        sources: (answerResult.sources || []).concat(attributionResult?.sources || []),
      };
    }

    return {
      question,
      attributedAnswer: attributionResult.attributedAnswer,
      sources: attributionResult.sources,
    };
  } catch (e) {
    console.error(e);
    // It's better to provide a generic error message to the user
    return {
      question,
      error: 'An unexpected error occurred. Please check your connection or try again later.',
    };
  }
}

export async function loginAction(previousState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }
  try {
    await signInWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect('/');
}

export async function signupAction(previousState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }
  try {
    await createUserWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect('/');
}

export async function logoutAction() {
  await signOut(auth);
  redirect('/');
}
